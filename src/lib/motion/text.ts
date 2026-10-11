export type SplitWord = { word: string; chars: string[] };

const graphemes = new Intl.Segmenter("pt-BR", { granularity: "grapheme" });

/**
 * Divide um texto em palavras e caracteres (grafemas), sem quebrar acentos ou emojis compostos.
 * Espaços múltiplos são normalizados.
 */
export function splitText(text: string): SplitWord[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({ word, chars: Array.from(graphemes.segment(word), (s) => s.segment) }));
}

/** Formata números no padrão brasileiro: 12500 → "12.500"; 4.9 com 1 casa → "4,9". */
export function formatNumberBR(value: number, decimals = 0): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Curva de desaceleração usada no CountUp (rápido no início, suave no fim). */
export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - 2 ** (-10 * t);
}
