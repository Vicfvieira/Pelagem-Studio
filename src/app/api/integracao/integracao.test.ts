import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET as getAppointments } from "@/app/api/integracao/agendamentos/route";
import { GET as getSummary } from "@/app/api/integracao/resumo/route";

const { prismaMock } = vi.hoisted(() => {
  const prismaMock = {
    $transaction: vi.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
    appointment: { count: vi.fn(), findMany: vi.fn() },
  };
  return { prismaMock };
});
vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

const API_KEY = "chave-de-teste-integracao";
const SALT = "salt-de-teste";

/** Linha como o Prisma devolveria com o `select` da rota (sem dados pessoais). */
const ROW = {
  id: "apt1",
  userId: "user-123",
  status: "CONCLUIDO",
  size: "M",
  startAt: new Date("2026-10-06T17:30:00.000Z"),
  endAt: new Date("2026-10-06T18:30:00.000Z"),
  durationMinutes: 60,
  priceCents: 8000,
  taxiFeeCents: 2000,
  totalCents: 10000,
  createdAt: new Date("2026-10-01T12:00:00.000Z"),
  cancelledAt: null,
  service: { slug: "banho", name: "Banho" },
  taxiZone: { name: "Sul" },
};

let ipCounter = 0;
/** Cada teste usa um IP próprio, para o limite de requisições de um não afetar o outro. */
function request(path: string, init: { key?: string | null; ip?: string } = {}) {
  const headers = new Headers({ "x-forwarded-for": init.ip ?? `203.0.113.${++ipCounter}` });
  if (init.key !== null) headers.set("x-api-key", init.key ?? API_KEY);
  return new NextRequest(`http://localhost${path}`, { headers });
}

beforeEach(() => {
  vi.stubEnv("INTEGRATION_API_KEY", API_KEY);
  vi.stubEnv("HASH_SALT", SALT);
  prismaMock.appointment.count.mockResolvedValue(45);
  prismaMock.appointment.findMany.mockResolvedValue([ROW]);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("autenticação por x-api-key", () => {
  it.each([
    ["sem header", null],
    ["com chave errada", "chave-errada"],
  ])("responde 401 %s e não consulta o banco", async (_, key) => {
    for (const handler of [getAppointments, getSummary]) {
      const response = await handler(request("/api/integracao/agendamentos", { key }));
      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ erro: "Chave de API ausente ou inválida." });
    }
    expect(prismaMock.appointment.findMany).not.toHaveBeenCalled();
  });

  it("responde 401 se a chave não estiver configurada no servidor (falha fechada)", async () => {
    vi.stubEnv("INTEGRATION_API_KEY", "");
    expect((await getAppointments(request("/api/integracao/agendamentos", { key: "" }))).status).toBe(401);
  });
});

describe("limite de 60 req/min por IP", () => {
  it("a 61ª requisição do mesmo IP recebe 429 com Retry-After, mesmo com chave errada antes", async () => {
    const ip = "198.51.100.77";
    for (let i = 0; i < 30; i++) await getAppointments(request("/api/integracao/agendamentos", { ip, key: "errada" }));
    for (let i = 0; i < 30; i++) {
      const ok = await getSummary(request("/api/integracao/resumo", { ip }));
      expect(ok.status).toBe(200);
    }
    const blocked = await getAppointments(request("/api/integracao/agendamentos", { ip }));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toMatch(/^\d+$/);
    expect(blocked.headers.get("X-RateLimit-Remaining")).toBe("0");

    // Outro IP continua liberado.
    expect((await getAppointments(request("/api/integracao/agendamentos"))).status).toBe(200);
  });
});

describe("GET /api/integracao/agendamentos", () => {
  it("devolve dados paginados sem informação pessoal", async () => {
    const response = await getAppointments(
      request("/api/integracao/agendamentos?desde=2026-10-01&ate=2026-10-31&pagina=2&porPagina=10"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("X-RateLimit-Limit")).toBe("60");

    const body = await response.json();
    expect(body.paginacao).toEqual({ pagina: 2, porPagina: 10, total: 45, totalPaginas: 5 });
    expect(body.filtros).toEqual({ desde: "2026-10-01", ate: "2026-10-31" });
    expect(body.dados[0]).toEqual({
      id: "apt1",
      clienteHash: createHash("sha256").update(`user-123${SALT}`).digest("hex"),
      servico: { slug: "banho", nome: "Banho" },
      porte: "M",
      status: "CONCLUIDO",
      inicio: "2026-10-06T17:30:00.000Z",
      fim: "2026-10-06T18:30:00.000Z",
      duracaoMinutos: 60,
      valorServicoCentavos: 8000,
      taxaTaxiCentavos: 2000,
      totalCentavos: 10000,
      zonaTaxi: "Sul",
      criadoEm: "2026-10-01T12:00:00.000Z",
      canceladoEm: null,
    });

    const json = JSON.stringify(body);
    for (const forbidden of ["user-123", "userId", "email", "phone", "telefone", "taxiAddress", "taxiCep", "pet"]) {
      expect(json).not.toContain(forbidden);
    }
  });

  it("traduz período e página para a consulta (datas de SP, ambas inclusivas)", async () => {
    await getAppointments(request("/api/integracao/agendamentos?desde=2026-10-01&ate=2026-10-31&pagina=2&porPagina=10"));
    const args = prismaMock.appointment.findMany.mock.calls[0][0];
    expect(args.where).toEqual({
      startAt: { gte: new Date("2026-10-01T03:00:00.000Z"), lt: new Date("2026-11-01T03:00:00.000Z") },
    });
    expect(args).toMatchObject({ skip: 10, take: 10 });
    // O select nunca pede o usuário, o pet nem o endereço.
    expect(Object.keys(args.select)).not.toEqual(expect.arrayContaining(["user", "pet", "taxiAddress", "taxiCep", "notes"]));
  });

  it("sem filtros, não restringe datas e usa os padrões de paginação", async () => {
    await getAppointments(request("/api/integracao/agendamentos"));
    expect(prismaMock.appointment.findMany.mock.calls[0][0]).toMatchObject({ where: {}, skip: 0, take: 20 });
  });

  it("responde 400 com os campos inválidos", async () => {
    const response = await getAppointments(request("/api/integracao/agendamentos?porPagina=500&desde=2026-13-01"));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(Object.keys(body.campos).sort()).toEqual(["desde", "porPagina"]);
  });

  it("responde 503 se o HASH_SALT não estiver configurado (não gera hash sem salt)", async () => {
    vi.stubEnv("HASH_SALT", "");
    expect((await getAppointments(request("/api/integracao/agendamentos"))).status).toBe(503);
  });
});

describe("GET /api/integracao/resumo", () => {
  it("agrega o período e não expõe identificadores de clientes", async () => {
    prismaMock.appointment.findMany.mockResolvedValue([
      { userId: "u1", status: "CONCLUIDO", size: "M", durationMinutes: 60, totalCents: 10000, taxiFeeCents: 2000, service: { slug: "banho", name: "Banho" } },
      { userId: "u2", status: "CANCELADO", size: "P", durationMinutes: 30, totalCents: 2500, taxiFeeCents: 0, service: { slug: "corte-de-unhas", name: "Corte de unhas" } },
    ]);
    const response = await getSummary(request("/api/integracao/resumo?desde=2026-10-13&ate=2026-10-13"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      periodo: { desde: "2026-10-13", ate: "2026-10-13" },
      totalAgendamentos: 2,
      porStatus: { CONCLUIDO: 1, CANCELADO: 1, AGENDADO: 0 },
      taxaCancelamento: 0.5,
      receitaCentavos: 10000,
      clientesUnicos: 1,
      taxiDog: { quantidade: 1, receitaCentavos: 2000 },
    });
    expect(JSON.stringify(body)).not.toMatch(/u1|u2|userId/);
  });

  it("responde 400 se 'desde' for depois de 'ate'", async () => {
    expect((await getSummary(request("/api/integracao/resumo?desde=2026-10-20&ate=2026-10-01"))).status).toBe(400);
  });
});
