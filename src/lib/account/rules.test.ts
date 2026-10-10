import { describe, expect, it } from "vitest";

import { canCancel, suggestNextBath, vaccineStatus } from "@/lib/account/rules";
import { saoPauloDateTime } from "@/lib/business-rules";

describe("canCancel", () => {
  const start = saoPauloDateTime("2026-10-14", 10 * 60); // quarta, 10:00

  it("permite com mais de 24h de antecedência", () => {
    expect(canCancel(start, saoPauloDateTime("2026-10-12", 18 * 60))).toBe(true);
  });

  it("permite com exatamente 24h", () => {
    expect(canCancel(start, saoPauloDateTime("2026-10-13", 10 * 60))).toBe(true);
  });

  it("recusa com menos de 24h, mesmo que por 1 minuto", () => {
    expect(canCancel(start, saoPauloDateTime("2026-10-13", 10 * 60 + 1))).toBe(false);
  });

  it("recusa atendimento que já começou ou passou", () => {
    expect(canCancel(start, saoPauloDateTime("2026-10-14", 11 * 60))).toBe(false);
  });
});

describe("vaccineStatus", () => {
  const today = "2026-10-10";

  it.each([
    ["2026-10-09", "VENCIDA", -1],
    ["2026-10-10", "VENCE_EM_BREVE", 0],
    ["2026-11-09", "VENCE_EM_BREVE", 30],
    ["2026-11-10", "EM_DIA", 31],
  ] as const)("validade %s → %s (%i dias)", (validUntil, status, daysLeft) => {
    expect(vaccineStatus(validUntil, today)).toEqual({ status, daysLeft });
  });

  it("atravessa a virada de ano sem erro de fuso", () => {
    expect(vaccineStatus("2027-01-01", "2026-12-31")).toEqual({ status: "VENCE_EM_BREVE", daysLeft: 1 });
  });
});

describe("suggestNextBath", () => {
  const today = "2026-10-10";

  it("sugere 15 dias após o último banho concluído", () => {
    expect(suggestNextBath({ lastCompletedBathDate: "2026-10-01", nextScheduledBathDate: null, today })).toEqual({
      status: "EM_DIA",
      suggestedDate: "2026-10-16",
      lastBathDate: "2026-10-01",
    });
  });

  it("hoje ainda é em dia; ontem já é atrasado", () => {
    expect(suggestNextBath({ lastCompletedBathDate: "2026-09-25", nextScheduledBathDate: null, today }).status).toBe("EM_DIA");
    expect(suggestNextBath({ lastCompletedBathDate: "2026-09-24", nextScheduledBathDate: null, today }).status).toBe("ATRASADO");
  });

  it("não sugere se já há banho agendado", () => {
    expect(suggestNextBath({ lastCompletedBathDate: "2026-08-01", nextScheduledBathDate: "2026-10-20", today })).toEqual({
      status: "JA_AGENDADO",
      scheduledDate: "2026-10-20",
    });
  });

  it("sem histórico de banho", () => {
    expect(suggestNextBath({ lastCompletedBathDate: null, nextScheduledBathDate: null, today })).toEqual({
      status: "SEM_HISTORICO",
    });
  });
});
