import { describe, expect, it } from "vitest";

import { nextStage, stageProgress, stagesFor, todayRange } from "@/lib/tracking/stages";

describe("etapas do atendimento", () => {
  it("tosa só aparece nos serviços com tosa; corte de unhas não tem banho", () => {
    expect(stagesFor("tosa-completa")).toEqual(["RECEBIDO", "BANHO", "SECAGEM", "TOSA", "PRONTO"]);
    expect(stagesFor("banho")).toEqual(["RECEBIDO", "BANHO", "SECAGEM", "PRONTO"]);
    expect(stagesFor("corte-de-unhas")).toEqual(["RECEBIDO", "PRONTO"]);
  });

  it("avança na ordem e termina em PRONTO", () => {
    expect(nextStage("banho", null)).toBe("RECEBIDO");
    expect(nextStage("banho", "SECAGEM")).toBe("PRONTO");
    expect(nextStage("tosa-completa", "SECAGEM")).toBe("TOSA");
    expect(nextStage("banho", "PRONTO")).toBeNull();
  });

  it("recusa etapa que não existe para o serviço", () => {
    expect(() => nextStage("banho", "TOSA")).toThrow();
  });

  it("calcula o progresso", () => {
    expect(stageProgress("banho", null)).toBe(0);
    expect(stageProgress("banho", "BANHO")).toBe(0.5);
    expect(stageProgress("tosa-completa", "PRONTO")).toBe(1);
  });

  it("hoje vai da meia-noite à meia-noite de São Paulo (UTC-3)", () => {
    // 01h UTC de 11/10 ainda é 10/10 em São Paulo.
    expect(todayRange(new Date("2026-10-11T01:00:00Z"))).toEqual({
      start: new Date("2026-10-10T03:00:00Z"),
      end: new Date("2026-10-11T03:00:00Z"),
    });
  });
});
