/**
 * Fotografias do site: fonte única para as imagens e para a página /creditos.
 *
 * Só entram fotos livres de direitos (Unsplash License, Pexels License ou CC0), com autor e link.
 * Arquivos em /public/fotos (servidos pelo next/image, sem depender de site de terceiros).
 * Enquanto `src` for null, o lugar mostra a ilustração própria correspondente.
 */
export type PhotoSlot = "hero" | "antes" | "depois";

export type PhotoCredit = {
  author: string;
  authorUrl: string;
  source: "Unsplash" | "Pexels" | "Wikimedia Commons";
  sourceUrl: string;
  license: "Unsplash License" | "Pexels License" | "CC0";
};

export type Photo = {
  slot: PhotoSlot;
  /** Onde a foto aparece no site (para a página de créditos). */
  usedOn: string;
  alt: string;
  /** Caminho em /public, ex.: "/fotos/hero.jpg". */
  src: string | null;
  width: number;
  height: number;
  credit: PhotoCredit | null;
};

export const PHOTOS: Record<PhotoSlot, Photo> = {
  hero: {
    slot: "hero",
    usedOn: "Página inicial, topo",
    alt: "Cachorro de pelo caramelo enrolado numa toalha depois do banho, olhando para a câmera.",
    src: null,
    width: 1200,
    height: 1200,
    credit: null,
  },
  antes: {
    slot: "antes",
    usedOn: "Página inicial, antes e depois",
    alt: "Lhasa Apso com o pelo comprido e embolado antes da tosa.",
    src: null,
    width: 1200,
    height: 900,
    credit: null,
  },
  depois: {
    slot: "depois",
    usedOn: "Página inicial, antes e depois",
    alt: "O mesmo Lhasa Apso depois da tosa na tesoura, com o pelo curto e alinhado.",
    src: null,
    width: 1200,
    height: 900,
    credit: null,
  },
};

/** Fotos já publicadas (com arquivo e crédito), na ordem em que aparecem em /creditos. */
export function publishedPhotos(): Array<Photo & { src: string; credit: PhotoCredit }> {
  return Object.values(PHOTOS).filter((photo): photo is Photo & { src: string; credit: PhotoCredit } =>
    Boolean(photo.src && photo.credit),
  );
}
