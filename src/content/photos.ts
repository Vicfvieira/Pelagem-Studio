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
  /** Sem link quando a autoria não tem página pública. */
  authorUrl: string | null;
  source: "Unsplash" | "Pexels" | "Wikimedia Commons" | "Enviada pela autora do projeto";
  sourceUrl: string | null;
  license: "Unsplash License" | "Pexels License" | "CC0" | "Licença a confirmar";
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
    alt: "Um gato de pelo longo caramelo encostado num cachorro preto e branco sorridente, lado a lado.",
    // Recorte (fundo removido) feito a partir da foto enviada pela autora; origem e licença a confirmar.
    src: "/fotos/pets-hero.webp",
    width: 681,
    height: 682,
    credit: {
      author: "Victoria Fernandes Vieira (envio)",
      authorUrl: null,
      source: "Enviada pela autora do projeto",
      sourceUrl: null,
      license: "Licença a confirmar",
    },
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
