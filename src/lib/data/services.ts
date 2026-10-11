import { cacheLife } from "next/cache";

import { PET_SIZES, type PetSizeCode } from "@/lib/business-rules";
import { prisma } from "@/lib/prisma";

const FEATURED_SLUGS = ["banho", "banho-tosa-higienica", "tosa-completa"];

export type FeaturedService = {
  slug: string;
  name: string;
  description: string;
  fromPriceCents: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
};

/** Serviços da home com "a partir de" (menor preço entre os portes). Cache de 1 hora. */
export async function getFeaturedServices(): Promise<FeaturedService[]> {
  "use cache";
  cacheLife("hours");

  const services = await prisma.service.findMany({
    where: { active: true, slug: { in: FEATURED_SLUGS } },
    orderBy: { sortOrder: "asc" },
    select: {
      slug: true,
      name: true,
      description: true,
      prices: { select: { priceCents: true, durationMinutes: true } },
    },
  });

  return services
    .filter((service) => service.prices.length > 0)
    .map(({ prices, ...service }) => ({
      ...service,
      fromPriceCents: Math.min(...prices.map((p) => p.priceCents)),
      minDurationMinutes: Math.min(...prices.map((p) => p.durationMinutes)),
      maxDurationMinutes: Math.max(...prices.map((p) => p.durationMinutes)),
    }));
}

export type PriceBySize = Record<PetSizeCode, { priceCents: number; durationMinutes: number }>;

export type CatalogService = {
  slug: string;
  name: string;
  description: string;
  prices: PriceBySize;
};

/** Todos os serviços ativos com preço e duração por porte. Cache de 1 hora. */
export async function getServicesCatalog(): Promise<CatalogService[]> {
  "use cache";
  cacheLife("hours");

  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: {
      slug: true,
      name: true,
      description: true,
      prices: { select: { size: true, priceCents: true, durationMinutes: true } },
    },
  });

  // Só exibe serviços com preço cadastrado para os três portes.
  return services.flatMap(({ prices, ...service }) => {
    const bySize = Object.fromEntries(
      prices.map((p) => [p.size, { priceCents: p.priceCents, durationMinutes: p.durationMinutes }]),
    ) as Partial<PriceBySize>;
    if (!PET_SIZES.every((size) => bySize[size])) return [];
    return [{ ...service, prices: bySize as PriceBySize }];
  });
}

export type TaxiFee = { zones: string[]; feeCents: number };

/** Taxas do táxi dog agrupadas por valor (ex.: "Sul e Oeste: R$ 20,00"). Cache de 1 hora. */
export async function getTaxiFees(): Promise<TaxiFee[]> {
  "use cache";
  cacheLife("hours");

  const zones = await prisma.taxiZone.findMany({
    select: { name: true, feeCents: true },
    orderBy: { feeCents: "asc" },
  });

  const byFee = new Map<number, Set<string>>();
  for (const zone of zones) {
    byFee.set(zone.feeCents, (byFee.get(zone.feeCents) ?? new Set()).add(zone.name));
  }
  return [...byFee].map(([feeCents, names]) => ({ feeCents, zones: [...names] }));
}
