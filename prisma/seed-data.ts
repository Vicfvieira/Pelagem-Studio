import type { PetSizeCode } from "../src/lib/business-rules";

type PriceBySize = Record<PetSizeCode, { priceCents: number; durationMinutes: number }>;

export const SERVICES: ReadonlyArray<{
  slug: string;
  name: string;
  description: string;
  prices: PriceBySize;
}> = [
  {
    slug: "banho",
    name: "Banho",
    description:
      "Banho com shampoo hipoalergênico, secagem cuidadosa, limpeza de ouvidos e perfume suave.",
    prices: {
      P: { priceCents: 6000, durationMinutes: 60 },
      M: { priceCents: 8000, durationMinutes: 60 },
      G: { priceCents: 11000, durationMinutes: 90 },
    },
  },
  {
    slug: "banho-tosa-higienica",
    name: "Banho + Tosa higiênica",
    description:
      "Banho completo com aparo das regiões íntimas, patinhas e contorno dos olhos.",
    prices: {
      P: { priceCents: 8000, durationMinutes: 90 },
      M: { priceCents: 10500, durationMinutes: 90 },
      G: { priceCents: 14000, durationMinutes: 120 },
    },
  },
  {
    slug: "tosa-completa",
    name: "Tosa completa",
    description:
      "Banho e tosa na máquina ou tesoura, no padrão da raça ou do jeitinho que você preferir.",
    prices: {
      P: { priceCents: 11000, durationMinutes: 120 },
      M: { priceCents: 14000, durationMinutes: 150 },
      G: { priceCents: 18000, durationMinutes: 180 },
    },
  },
  {
    slug: "hidratacao",
    name: "Hidratação",
    description:
      "Máscara de hidratação profunda para pelos ressecados, com escovação e finalização.",
    prices: {
      P: { priceCents: 5000, durationMinutes: 30 },
      M: { priceCents: 6500, durationMinutes: 60 },
      G: { priceCents: 8500, durationMinutes: 60 },
    },
  },
  {
    slug: "corte-de-unhas",
    name: "Corte de unhas",
    description: "Corte e lixamento das unhas com todo o cuidado para não machucar.",
    prices: {
      P: { priceCents: 2500, durationMinutes: 30 },
      M: { priceCents: 3000, durationMinutes: 30 },
      G: { priceCents: 3500, durationMinutes: 30 },
    },
  },
];

/**
 * Faixas de CEP da capital paulista por zona (prefixos dos Correios).
 * CEP fora de todas as faixas = fora da área do táxi dog.
 */
export const TAXI_ZONES: ReadonlyArray<{
  name: string;
  cepStart: number;
  cepEnd: number;
  feeCents: number;
}> = [
  { name: "Centro", cepStart: 1000000, cepEnd: 1999999, feeCents: 1500 },
  { name: "Norte", cepStart: 2000000, cepEnd: 2999999, feeCents: 2500 },
  { name: "Leste", cepStart: 3000000, cepEnd: 3999999, feeCents: 2500 },
  { name: "Sul", cepStart: 4000000, cepEnd: 4999999, feeCents: 2000 },
  { name: "Oeste", cepStart: 5000000, cepEnd: 5999999, feeCents: 2000 },
  { name: "Leste", cepStart: 8000000, cepEnd: 8499999, feeCents: 2500 },
];

type Breed = { breed: string; minKg: number; maxKg: number };

export const DOG_BREEDS: readonly Breed[] = [
  { breed: "Shih-tzu", minKg: 4, maxKg: 8 },
  { breed: "Yorkshire", minKg: 2, maxKg: 4 },
  { breed: "Lhasa Apso", minKg: 5, maxKg: 8 },
  { breed: "Poodle", minKg: 3, maxKg: 9 },
  { breed: "Spitz Alemão", minKg: 2, maxKg: 5 },
  { breed: "SRD (vira-lata caramelo)", minKg: 8, maxKg: 22 },
  { breed: "Beagle", minKg: 9, maxKg: 14 },
  { breed: "Border Collie", minKg: 14, maxKg: 20 },
  { breed: "Cocker Spaniel", minKg: 11, maxKg: 15 },
  { breed: "Bulldog Francês", minKg: 9, maxKg: 13 },
  { breed: "Golden Retriever", minKg: 27, maxKg: 36 },
  { breed: "Labrador", minKg: 26, maxKg: 35 },
  { breed: "Pastor Alemão", minKg: 28, maxKg: 40 },
  { breed: "Husky Siberiano", minKg: 18, maxKg: 27 },
];

export const CAT_BREEDS: readonly Breed[] = [
  { breed: "Persa", minKg: 3, maxKg: 6 },
  { breed: "Siamês", minKg: 3, maxKg: 5 },
  { breed: "Maine Coon", minKg: 5, maxKg: 9 },
  { breed: "SRD", minKg: 3, maxKg: 6 },
];

export const PET_NAMES = [
  "Paçoca", "Thor", "Mel", "Bolinha", "Luna", "Fred", "Pipoca", "Nina", "Bob", "Amora",
  "Pandora", "Zeca", "Mia", "Toddy", "Cookie", "Lola", "Rex", "Belinha", "Max", "Jade",
  "Biscoito", "Pituca", "Simba", "Frida", "Chico", "Kiara", "Tobias", "Cacau", "Bento", "Maya",
] as const;

export const DOG_VACCINES = ["V10", "Antirrábica", "Gripe canina", "Giárdia"] as const;
export const CAT_VACCINES = ["V4 felina", "Antirrábica"] as const;
