import { beforeEach, describe, expect, it, vi } from "vitest";

import { isSaoPauloCapital, lookupCep, quoteTaxi } from "@/lib/booking/taxi";
import { normalizeCep } from "@/lib/validation/booking";

// Faixas de CEP iguais às do seed, para testar sem banco.
const ZONES = [
  { id: "centro", name: "Centro", cepStart: 1000000, cepEnd: 1999999, feeCents: 1500 },
  { id: "sul", name: "Sul", cepStart: 4000000, cepEnd: 4999999, feeCents: 2000 },
  { id: "leste-2", name: "Leste", cepStart: 8000000, cepEnd: 8499999, feeCents: 2500 },
];

vi.mock("@/lib/prisma", () => ({
  prisma: {
    taxiZone: {
      findFirst: vi.fn(
        async ({ where }: { where: { cepStart: { lte: number }; cepEnd: { gte: number } } }) =>
          ZONES.find((z) => z.cepStart <= where.cepStart.lte && z.cepEnd >= where.cepEnd.gte) ?? null,
      ),
    },
  },
}));

/** Respostas no formato real do ViaCEP. */
const PAULISTA = {
  cep: "01310-100",
  logradouro: "Avenida Paulista",
  complemento: "de 612 a 1510 - lado par",
  bairro: "Bela Vista",
  localidade: "São Paulo",
  uf: "SP",
  ibge: "3550308",
  ddd: "11",
};
const COPACABANA = { ...PAULISTA, cep: "22041-001", logradouro: "Rua Barata Ribeiro", bairro: "Copacabana", localidade: "Rio de Janeiro", uf: "RJ", ibge: "3304557" };
const GUARULHOS = { ...PAULISTA, cep: "07010-000", bairro: "Centro", localidade: "Guarulhos", ibge: "3518800" };

function fakeFetch(body: unknown, status = 200) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;
}

describe("normalizeCep", () => {
  it("remove máscara e espaços", () => {
    expect(normalizeCep(" 01310-100 ")).toBe("01310100");
  });
});

describe("lookupCep", () => {
  it("devolve o endereço de um CEP válido", async () => {
    const fetchMock = fakeFetch(PAULISTA);
    const result = await lookupCep("01310100", fetchMock);
    expect(result).toMatchObject({ ok: true, address: { logradouro: "Avenida Paulista", localidade: "São Paulo" } });
    expect(fetchMock).toHaveBeenCalledWith("https://viacep.com.br/ws/01310100/json/", expect.anything());
  });

  it.each([{ erro: true }, { erro: "true" }])("trata %o como CEP inexistente", async (body) => {
    expect(await lookupCep("99999999", fakeFetch(body))).toEqual({ ok: false, reason: "NAO_ENCONTRADO" });
  });

  it("trata 400 como CEP inexistente e 5xx como indisponível", async () => {
    expect(await lookupCep("123", fakeFetch({}, 400))).toEqual({ ok: false, reason: "NAO_ENCONTRADO" });
    expect(await lookupCep("01310100", fakeFetch({}, 503))).toEqual({ ok: false, reason: "INDISPONIVEL" });
  });

  it("trata falha de rede, timeout e resposta fora do formato como indisponível", async () => {
    const offline = vi.fn(async () => {
      throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
    }) as unknown as typeof fetch;
    expect(await lookupCep("01310100", offline)).toEqual({ ok: false, reason: "INDISPONIVEL" });
    expect(await lookupCep("01310100", fakeFetch({ qualquer: "coisa" }))).toEqual({ ok: false, reason: "INDISPONIVEL" });
  });
});

describe("isSaoPauloCapital", () => {
  it("usa o código IBGE do município", () => {
    expect(isSaoPauloCapital(PAULISTA)).toBe(true);
    expect(isSaoPauloCapital(GUARULHOS)).toBe(false); // Grande SP não conta
    expect(isSaoPauloCapital(COPACABANA)).toBe(false);
  });
});

describe("quoteTaxi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calcula a taxa pela zona do CEP", async () => {
    expect(await quoteTaxi("01310100", fakeFetch(PAULISTA))).toEqual({
      ok: true,
      cep: "01310100",
      zoneId: "centro",
      zoneName: "Centro",
      feeCents: 1500,
      street: "Avenida Paulista",
      neighborhood: "Bela Vista",
    });
  });

  it("recusa cidade fora de São Paulo, mesmo com CEP válido", async () => {
    expect(await quoteTaxi("22041001", fakeFetch(COPACABANA))).toEqual({
      ok: false,
      message: "O táxi dog atende apenas a cidade de São Paulo.",
    });
  });

  it("recusa CEP da capital sem zona cadastrada", async () => {
    const noZone = { ...PAULISTA, cep: "05433-000", bairro: "Vila Madalena" };
    const result = await quoteTaxi("05433000", fakeFetch(noZone));
    expect(result).toEqual({ ok: false, message: "Ainda não atendemos esta região com o táxi dog." });
  });

  it("explica quando o CEP não existe", async () => {
    expect(await quoteTaxi("99999999", fakeFetch({ erro: "true" }))).toEqual({
      ok: false,
      message: "CEP não encontrado. Confira os números.",
    });
  });
});
