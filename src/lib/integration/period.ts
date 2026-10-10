import { addDaysToDate, saoPauloDateTime, toSaoPauloDate } from "@/lib/business-rules";

/** Período padrão do resumo: os últimos 30 dias, incluindo hoje. */
export const DEFAULT_SUMMARY_DAYS = 30;

/** Datas locais (inclusivas) → intervalo UTC [início do 1º dia, início do dia seguinte ao último). */
export function periodToUtcRange(desde?: string, ate?: string): { gte?: Date; lt?: Date } {
  return {
    ...(desde ? { gte: saoPauloDateTime(desde, 0) } : {}),
    ...(ate ? { lt: saoPauloDateTime(addDaysToDate(ate, 1), 0) } : {}),
  };
}

/**
 * Período do resumo:
 * - sem datas: os últimos 30 dias, incluindo hoje;
 * - só `desde`: 30 dias a partir dela; só `ate`: os 30 dias que terminam nela;
 * - as duas: exatamente o período informado.
 */
export function resolveSummaryPeriod(
  query: { desde?: string; ate?: string },
  now = new Date(),
): { desde: string; ate: string } {
  const span = DEFAULT_SUMMARY_DAYS - 1;
  if (query.desde && query.ate) return { desde: query.desde, ate: query.ate };
  if (query.desde) return { desde: query.desde, ate: addDaysToDate(query.desde, span) };
  const ate = query.ate ?? toSaoPauloDate(now);
  return { desde: addDaysToDate(ate, -span), ate };
}
