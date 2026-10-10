import { describe, expect, it } from "vitest";

import {
  ADDONS,
  LONG_COAT_SURCHARGE_CENTS,
  PLANS,
  estimateQuote,
  quoteNotes,
  quotePlan,
  quoteSearchParams,
} from "@/lib/pricing-extras";

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

describe("simulador de orçamento", () => {
  const services = [
    {
      slug: "banho",
      name: "Banho",
      prices: {
        P: { priceCents: 6000, durationMinutes: 60 },
        M: { priceCents: 8000, durationMinutes: 60 },
        G: { priceCents: 11000, durationMinutes: 90 },
      },
    },
    {
      slug: "corte-de-unhas",
      name: "Corte de unhas",
      prices: {
        P: { priceCents: 2500, durationMinutes: 30 },
        M: { priceCents: 3000, durationMinutes: 30 },
        G: { priceCents: 3500, durationMinutes: 30 },
      },
    },
  ];

  it("soma serviço por porte, pelagem longa e adicionais", () => {
    const quote = estimateQuote({ serviceSlug: "banho", size: "M", longCoat: true, addonIds: ["perfume", "desembolo"] }, services);
    expect(quote?.lines.map((line) => line.cents)).toEqual([8000, 2000, 2500, 1000]);
    expect(quote).toMatchObject({ totalCents: 13500, durationMinutes: 60 });
  });

  it("pelagem longa não se aplica a corte de unhas; ids desconhecidos são ignorados", () => {
    const quote = estimateQuote({ serviceSlug: "corte-de-unhas", size: "G", longCoat: true, addonIds: ["hacker"] }, services);
    expect(quote?.totalCents).toBe(3500);
  });

  it("serviço inexistente não gera orçamento", () => {
    expect(estimateQuote({ serviceSlug: "spa-lunar", size: "P", longCoat: false, addonIds: [] }, services)).toBeNull();
  });

  it("monta o link do agendamento e as observações a partir de uma lista fechada", () => {
    const params = quoteSearchParams({ serviceSlug: "banho", size: "P", longCoat: true, addonIds: ["laco-bandana"] });
    expect(params.toString()).toBe("servico=banho&porte=P&pelo=longo&adicionais=laco-bandana");
    expect(quoteNotes({ pelo: params.get("pelo"), adicionais: params.get("adicionais") })).toBe(
      "Do simulador de orçamento: pelagem longa; adicionais: laço ou bandana.",
    );
    expect(quoteNotes({ pelo: "<script>", adicionais: "texto livre,perfume" })).toBe(
      "Do simulador de orçamento: adicionais: perfume especial.",
    );
    expect(quoteNotes({})).toBe("");
  });
});
