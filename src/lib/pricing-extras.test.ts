import { describe, expect, it } from "vitest";

import { ADDONS, LONG_COAT_SURCHARGE_CENTS, PLANS, quotePlan } from "@/lib/pricing-extras";

describe("quotePlan", () => {
  it("aplica o desconto sobre o valor avulso do mês", () => {
    // Banho P = R$ 60 → 2 banhos = R$ 120 → 10% = R$ 108
    expect(quotePlan({ bathsPerMonth: 2, discountPercent: 10 }, 6000)).toEqual({
      fullPriceCents: 12000,
      planPriceCents: 10800,
      savingsCents: 1200,
    });
  });

  it("arredonda para baixo em reais inteiros (a economia nunca diminui)", () => {
    // Banho M = R$ 80 → 4 banhos = R$ 320 → 15% = R$ 272
    expect(quotePlan({ bathsPerMonth: 4, discountPercent: 15 }, 8000).planPriceCents).toBe(27200);
    // R$ 61,50 × 2 × 0,9 = R$ 110,70 → R$ 110
    expect(quotePlan({ bathsPerMonth: 2, discountPercent: 10 }, 6150)).toMatchObject({
      planPriceCents: 11000,
      savingsCents: 1300,
    });
  });

  it("recusa preço inválido", () => {
    expect(() => quotePlan(PLANS[0], -1)).toThrow();
    expect(() => quotePlan(PLANS[0], 10.5)).toThrow();
  });
});

describe("dados de preço", () => {
  it("pelagem longa cresce com o porte e adicionais têm preço positivo em centavos inteiros", () => {
    expect(LONG_COAT_SURCHARGE_CENTS.P).toBeLessThan(LONG_COAT_SURCHARGE_CENTS.M);
    expect(LONG_COAT_SURCHARGE_CENTS.M).toBeLessThan(LONG_COAT_SURCHARGE_CENTS.G);
    for (const addon of ADDONS) expect(Number.isInteger(addon.priceCents) && addon.priceCents > 0).toBe(true);
  });

  it("planos com mais banhos dão mais desconto", () => {
    const [biweekly, weekly] = PLANS;
    expect(weekly.bathsPerMonth).toBeGreaterThan(biweekly.bathsPerMonth);
    expect(weekly.discountPercent).toBeGreaterThan(biweekly.discountPercent);
  });
});
