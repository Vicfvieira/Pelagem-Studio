import { cacheLife } from "next/cache";

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
