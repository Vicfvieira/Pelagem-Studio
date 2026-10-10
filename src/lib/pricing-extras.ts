import { NEXT_BATH_DAYS, type PetSizeCode } from "@/lib/business-rules";

/**
 * Valores que complementam a tabela do banco: pelagem longa, adicionais e planos.
 * Fonte única para /precos (e para o simulador de orçamento da etapa A4).
 * Pelagem longa e adicionais são confirmados na avaliação de chegada, sempre com aviso ao tutor.
 */

/** Acréscimo por pelagem longa, por porte (centavos). Vale para banho, banho + tosa e tosa completa. */
export const LONG_COAT_SURCHARGE_CENTS: Record<PetSizeCode, number> = { P: 1500, M: 2000, G: 3000 };

export const LONG_COAT_SERVICE_SLUGS = ["banho", "banho-tosa-higienica", "tosa-completa"] as const;

export const LONG_COAT_BREEDS: Record<PetSizeCode, readonly string[]> = {
  P: ["Shih-tzu", "Lhasa Apso", "Yorkshire", "Maltês", "Spitz Alemão"],
  M: ["Cocker Spaniel", "Schnauzer", "Poodle médio", "Border Collie"],
  G: ["Golden Retriever", "Chow-chow", "Collie", "Samoieda"],
};

export type Addon = {
  id: "desembolo" | "perfume" | "laco-bandana" | "escovacao-dentes";
  name: string;
  description: string;
  priceCents: number;
  /** Texto de unidade, ex.: "a cada 15 min". */
  unit?: string;
};

export const ADDONS: readonly Addon[] = [
  {
    id: "desembolo",
    name: "Desembolo",
    description: "Retirada de nós com pente e condicionador, sem raspar. Avisamos o tempo estimado antes de começar.",
    priceCents: 2500,
    unit: "a cada 15 min",
  },
  {
    id: "perfume",
    name: "Perfume especial",
    description: "Colônia pet sem álcool, com fragrância suave que dura cerca de 3 dias.",
    priceCents: 1000,
  },
  {
    id: "laco-bandana",
    name: "Laço ou bandana",
    description: "Acessório de tecido para levar para casa. Escolha a cor na recepção.",
    priceCents: 800,
  },
  {
    id: "escovacao-dentes",
    name: "Escovação de dentes",
    description: "Escova macia e creme dental veterinário. Não substitui a limpeza feita pelo veterinário.",
    priceCents: 2000,
  },
];

export type Plan = {
  id: "quinzenal" | "semanal";
  name: string;
  description: string;
  bathsPerMonth: number;
  /** Desconto sobre o valor avulso, em pontos percentuais. */
  discountPercent: number;
  perks: readonly string[];
};

export const PLANS: readonly Plan[] = [
  {
    id: "quinzenal",
    name: "Plano Quinzenal",
    description: `2 banhos por mês, um a cada ${NEXT_BATH_DAYS} dias: o intervalo que recomendamos para a maioria dos cães.`,
    bathsPerMonth: 2,
    discountPercent: 10,
    perks: ["Horário fixo reservado", "Perfume especial incluso"],
  },
  {
    id: "semanal",
    name: "Plano Semanal",
    description: "4 banhos por mês para quem passeia muito, mora com criança pequena ou tem pet de pelo claro.",
    bathsPerMonth: 4,
    discountPercent: 15,
    perks: ["Horário fixo reservado", "Perfume especial incluso", "1 corte de unhas por mês"],
  },
];

export type PlanQuote = { fullPriceCents: number; planPriceCents: number; savingsCents: number };

/**
 * Valor mensal do plano a partir do preço avulso do banho (vindo do banco) para o porte.
 * Arredonda para baixo em reais inteiros: o tutor nunca paga centavos "quebrados".
 */
export function quotePlan(plan: Pick<Plan, "bathsPerMonth" | "discountPercent">, bathPriceCents: number): PlanQuote {
  if (!Number.isInteger(bathPriceCents) || bathPriceCents < 0) throw new Error("Preço do banho inválido.");
  const fullPriceCents = bathPriceCents * plan.bathsPerMonth;
  const discounted = (fullPriceCents * (100 - plan.discountPercent)) / 100;
  const planPriceCents = Math.floor(discounted / 100) * 100;
  return { fullPriceCents, planPriceCents, savingsCents: fullPriceCents - planPriceCents };
}

export type QuoteServicePrices = {
  slug: string;
  name: string;
  prices: Record<PetSizeCode, { priceCents: number; durationMinutes: number }>;
};

export type QuoteInput = {
  serviceSlug: string;
  size: PetSizeCode;
  longCoat: boolean;
  addonIds: readonly string[];
};

export type QuoteLine = { label: string; cents: number };
export type Quote = { lines: QuoteLine[]; totalCents: number; durationMinutes: number };

const longCoatApplies = (slug: string) => (LONG_COAT_SERVICE_SLUGS as readonly string[]).includes(slug);

/**
 * Estimativa do simulador: serviço pelo porte + pelagem longa (quando se aplica) + adicionais.
 * Ids desconhecidos são ignorados. É só uma prévia: o preço do serviço é recalculado no servidor
 * ao agendar, e pelagem longa e adicionais são confirmados na avaliação de chegada.
 */
export function estimateQuote(input: QuoteInput, services: readonly QuoteServicePrices[]): Quote | null {
  const service = services.find((s) => s.slug === input.serviceSlug);
  if (!service) return null;
  const base = service.prices[input.size];

  const lines: QuoteLine[] = [{ label: `${service.name} (porte ${input.size})`, cents: base.priceCents }];
  if (input.longCoat && longCoatApplies(service.slug)) {
    lines.push({ label: "Pelagem longa", cents: LONG_COAT_SURCHARGE_CENTS[input.size] });
  }
  for (const addon of ADDONS) {
    if (input.addonIds.includes(addon.id)) {
      lines.push({ label: addon.unit ? `${addon.name} (${addon.unit})` : addon.name, cents: addon.priceCents });
    }
  }
  return {
    lines,
    totalCents: lines.reduce((sum, line) => sum + line.cents, 0),
    durationMinutes: base.durationMinutes,
  };
}

/** Parâmetros que o simulador manda para /agendar (o porte e o serviço já existem no agendamento). */
export function quoteSearchParams(input: QuoteInput): URLSearchParams {
  const params = new URLSearchParams({ servico: input.serviceSlug, porte: input.size });
  if (input.longCoat && longCoatApplies(input.serviceSlug)) params.set("pelo", "longo");
  const addons = ADDONS.filter((addon) => input.addonIds.includes(addon.id)).map((addon) => addon.id);
  if (addons.length > 0) params.set("adicionais", addons.join(","));
  return params;
}

/**
 * Texto das observações do agendamento a partir dos parâmetros do simulador.
 * Só aceita valores conhecidos (lista fechada): um link montado por terceiros não injeta texto livre.
 */
export function quoteNotes(params: { pelo?: unknown; adicionais?: unknown }): string {
  const parts: string[] = [];
  if (params.pelo === "longo") parts.push("pelagem longa");
  const requested = typeof params.adicionais === "string" ? params.adicionais.split(",") : [];
  const addons = ADDONS.filter((addon) => requested.includes(addon.id)).map((addon) => addon.name.toLowerCase());
  if (addons.length > 0) parts.push(`adicionais: ${addons.join(", ")}`);
  return parts.length > 0 ? `Do simulador de orçamento: ${parts.join("; ")}.` : "";
}
