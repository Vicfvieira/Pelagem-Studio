import { describe, expect, it } from "vitest";

import { easeOutExpo, formatNumberBR, splitText } from "@/lib/motion/text";

describe("splitText", () => {
  it("separa palavras e letras preservando acentos", () => {
    expect(splitText("Banho  e tosa")).toEqual([
      { word: "Banho", chars: ["B", "a", "n", "h", "o"] },
      { word: "e", chars: ["e"] },
      { word: "tosa", chars: ["t", "o", "s", "a"] },
    ]);
    expect(splitText("Hidratação")[0].chars).toHaveLength(10);
  });

  it("não quebra grafemas compostos (acento combinado e emoji)", () => {
    expect(splitText("café")[0].chars).toEqual(["c", "a", "f", "é"]);
    expect(splitText("pet🐕‍🦺")[0].chars).toEqual(["p", "e", "t", "🐕‍🦺"]);
  });

  it("texto vazio vira lista vazia", () => {
    expect(splitText("   ")).toEqual([]);
  });
});

describe("formatNumberBR", () => {
  it("usa ponto como milhar e vírgula como decimal", () => {
    expect(formatNumberBR(12500)).toBe("12.500");
    expect(formatNumberBR(4.9, 1)).toBe("4,9");
    expect(formatNumberBR(0)).toBe("0");
  });
});

describe("easeOutExpo", () => {
  it("vai de 0 a 1 e é crescente", () => {
    expect(easeOutExpo(0)).toBe(0);
    expect(easeOutExpo(1)).toBe(1);
    expect(easeOutExpo(0.5)).toBeGreaterThan(0.9);
    expect(easeOutExpo(0.2)).toBeLessThan(easeOutExpo(0.3));
  });
});
