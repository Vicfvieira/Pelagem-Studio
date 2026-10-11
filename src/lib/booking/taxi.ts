import { z } from "zod";

import { prisma } from "@/lib/prisma";

/** Código IBGE do município de São Paulo: mais confiável que comparar o nome. */
const SAO_PAULO_IBGE = "3550308";
const VIACEP_TIMEOUT_MS = 5000;

/** Sobrescrevível só para testes locais; em produção usa o ViaCEP oficial. */
function viaCepBaseUrl(): string {
  return process.env.VIACEP_BASE_URL ?? "https://viacep.com.br/ws";
}

const viaCepSuccessSchema = z.object({
  cep: z.string(),
  logradouro: z.string(),
  bairro: z.string(),
  localidade: z.string(),
  uf: z.string(),
  ibge: z.string().optional(),
});

// O ViaCEP responde 200 com { erro: true } (ou "true") quando o CEP não existe.
const viaCepErrorSchema = z.object({ erro: z.union([z.literal(true), z.literal("true")]) });

export type CepAddress = z.infer<typeof viaCepSuccessSchema>;

export type CepLookupResult =
  | { ok: true; address: CepAddress }
  | { ok: false; reason: "NAO_ENCONTRADO" | "INDISPONIVEL" };

/** Consulta o ViaCEP com timeout e valida a resposta com Zod (nunca confia no formato externo). */
export async function lookupCep(cep: string, fetchImpl: typeof fetch = fetch): Promise<CepLookupResult> {
  try {
    const response = await fetchImpl(`${viaCepBaseUrl()}/${cep}/json/`, {
      signal: AbortSignal.timeout(VIACEP_TIMEOUT_MS),
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (response.status === 400) return { ok: false, reason: "NAO_ENCONTRADO" };
    if (!response.ok) return { ok: false, reason: "INDISPONIVEL" };

    const body: unknown = await response.json();
    if (viaCepErrorSchema.safeParse(body).success) return { ok: false, reason: "NAO_ENCONTRADO" };

    const parsed = viaCepSuccessSchema.safeParse(body);
    return parsed.success ? { ok: true, address: parsed.data } : { ok: false, reason: "INDISPONIVEL" };
  } catch {
    // Timeout, rede fora ou JSON inválido.
    return { ok: false, reason: "INDISPONIVEL" };
  }
}

export function isSaoPauloCapital(address: CepAddress): boolean {
  if (address.ibge) return address.ibge === SAO_PAULO_IBGE;
  return address.uf === "SP" && address.localidade.normalize("NFC") === "São Paulo";
}

export type TaxiQuote =
  | {
      ok: true;
      cep: string;
      zoneId: string;
      zoneName: string;
      feeCents: number;
      street: string;
      neighborhood: string;
    }
  | { ok: false; message: string };

const MESSAGES = {
  NAO_ENCONTRADO: "CEP não encontrado. Confira os números.",
  INDISPONIVEL: "Não conseguimos consultar o CEP agora. Tente de novo em instantes.",
  FORA_DE_SP: "O táxi dog atende apenas a cidade de São Paulo.",
  SEM_ZONA: "Ainda não atendemos esta região com o táxi dog.",
} as const;

/** CEP (8 dígitos) → endereço + zona + taxa. Usado no passo do táxi e de novo na confirmação. */
export async function quoteTaxi(cep: string, fetchImpl: typeof fetch = fetch): Promise<TaxiQuote> {
  const lookup = await lookupCep(cep, fetchImpl);
  if (!lookup.ok) return { ok: false, message: MESSAGES[lookup.reason] };
  if (!isSaoPauloCapital(lookup.address)) return { ok: false, message: MESSAGES.FORA_DE_SP };

  const cepNumber = Number(cep);
  const zone = await prisma.taxiZone.findFirst({
    where: { cepStart: { lte: cepNumber }, cepEnd: { gte: cepNumber } },
    select: { id: true, name: true, feeCents: true },
  });
  if (!zone) return { ok: false, message: MESSAGES.SEM_ZONA };

  return {
    ok: true,
    cep,
    zoneId: zone.id,
    zoneName: zone.name,
    feeCents: zone.feeCents,
    street: lookup.address.logradouro,
    neighborhood: lookup.address.bairro,
  };
}
