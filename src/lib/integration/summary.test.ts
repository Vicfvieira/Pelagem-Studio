import { describe, expect, it } from "vitest";

import { resolveSummaryPeriod } from "@/lib/integration/period";
import { openDaysBetween, summarize, type SummaryRow } from "@/lib/integration/summary";
import { saoPauloDateTime } from "@/lib/business-rules";
import { appointmentsQuerySchema, summaryQuerySchema } from "@/lib/validation/integration";

const banho = { slug: "banho", name: "Banho" };
const tosa = { slug: "tosa-completa", name: "Tosa completa" };

function row(overrides: Partial<SummaryRow>): SummaryRow {
  return { userId: "u1", status: "CONCLUIDO", size: "P", durationMinutes: 60, totalCents: 6000, taxiFeeCents: 0, service: banho, ...overrides };
}

describe("openDaysBetween", () => {
  it("conta só terça a sábado", () => {
    // 11/10/2026 (dom) a 17/10/2026 (sáb): ter, qua, qui, sex, sáb.
    expect(openDaysBetween("2026-10-11", "2026-10-17")).toBe(5);
    expect(openDaysBetween("2026-10-12", "2026-10-12")).toBe(0); // segunda
  });
});

describe("summarize", () => {
  const periodo = { desde: "2026-10-13", ate: "2026-10-13" }; // uma terça: 9h × 2 banhistas = 18h

  it("calcula status, receita, ticket, clientes, serviços, porte, táxi e ocupação", () => {
    const summary = summarize(
      [
        row({ userId: "u1", totalCents: 6000 }),
        row({ userId: "u2", service: tosa, size: "G", durationMinutes: 180, totalCents: 20000, taxiFeeCents: 2000 }),
        row({ userId: "u1", status: "AGENDADO", durationMinutes: 90, totalCents: 8000 }),
        row({ userId: "u3", status: "CANCELADO", totalCents: 9999 }),
      ],
      periodo,
    );

    expect(summary).toMatchObject({
      totalAgendamentos: 4,
      porStatus: { AGENDADO: 1, CONCLUIDO: 2, CANCELADO: 1 },
      taxaCancelamento: 0.25,
      receitaCentavos: 26000,
      receitaPrevistaCentavos: 8000,
      ticketMedioCentavos: 13000,
      clientesUnicos: 2, // u3 só tem cancelado
      porPorte: { P: 2, M: 0, G: 1 },
      taxiDog: { quantidade: 1, receitaCentavos: 2000 },
      ocupacao: { horasAtendidas: 5.5, horasDisponiveis: 18, percentual: 0.3056 },
    });
    expect(summary.porServico).toEqual([
      { slug: "banho", nome: "Banho", quantidade: 2, receitaCentavos: 6000 },
      { slug: "tosa-completa", nome: "Tosa completa", quantidade: 1, receitaCentavos: 20000 },
    ]);
  });

  it("período sem agendamentos não divide por zero", () => {
    expect(summarize([], { desde: "2026-10-12", ate: "2026-10-12" })).toMatchObject({
      totalAgendamentos: 0,
      taxaCancelamento: 0,
      ticketMedioCentavos: 0,
      ocupacao: { horasAtendidas: 0, horasDisponiveis: 0, percentual: 0 },
    });
  });
});

describe("resolveSummaryPeriod", () => {
  const now = saoPauloDateTime("2026-10-10", 15 * 60);

  it.each([
    [{}, { desde: "2026-09-11", ate: "2026-10-10" }],
    [{ desde: "2026-10-01" }, { desde: "2026-10-01", ate: "2026-10-30" }],
    [{ ate: "2026-10-31" }, { desde: "2026-10-02", ate: "2026-10-31" }],
    [{ desde: "2026-01-01", ate: "2026-03-31" }, { desde: "2026-01-01", ate: "2026-03-31" }],
  ])("%o → %o", (query, expected) => {
    expect(resolveSummaryPeriod(query, now)).toEqual(expected);
  });
});

describe("validação das queries", () => {
  it("aplica padrões de paginação", () => {
    expect(appointmentsQuerySchema.parse({})).toEqual({ pagina: 1, porPagina: 20 });
    expect(appointmentsQuerySchema.parse({ pagina: "3", porPagina: "50" })).toMatchObject({ pagina: 3, porPagina: 50 });
  });

  it.each([
    [{ porPagina: "101" }, "porPagina"],
    [{ pagina: "0" }, "pagina"],
    [{ pagina: "abc" }, "pagina"],
    [{ desde: "2026-02-30" }, "desde"],
    [{ desde: "2026-10-10", ate: "2026-10-01" }, "desde"],
    [{ desde: "2025-01-01", ate: "2026-12-31" }, "ate"],
  ])("recusa %o", (query, field) => {
    const result = appointmentsQuerySchema.safeParse(query);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path[0]).toBe(field);
  });

  it("o resumo usa as mesmas regras de período", () => {
    expect(summaryQuerySchema.safeParse({ desde: "2026-10-10", ate: "2026-10-01" }).success).toBe(false);
  });
});
