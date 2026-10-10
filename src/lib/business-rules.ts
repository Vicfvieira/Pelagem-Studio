/**
 * Regras de negócio do Pelagem Studio, fonte única para seed, agenda e telas.
 *
 * Fuso: São Paulo usa UTC-03:00 fixo (sem horário de verão desde 2019). Guardamos tudo em UTC
 * no banco e convertemos com este deslocamento, sem depender de bibliotecas de timezone.
 */

export const SAO_PAULO_UTC_OFFSET_MINUTES = -180;

/** Dias de funcionamento (getUTCDay da data local): terça (2) a sábado (6). */
export const OPEN_WEEKDAYS: readonly number[] = [2, 3, 4, 5, 6];
export const OPEN_MINUTE = 9 * 60;
export const CLOSE_MINUTE = 18 * 60;
export const SLOT_MINUTES = 30;
/** Dois banhistas: no máximo 2 atendimentos simultâneos por slot. */
export const SLOT_CAPACITY = 2;
export const MAX_DAYS_AHEAD = 30;
export const CANCELLATION_MIN_HOURS = 24;
export const NEXT_BATH_DAYS = 15;

export const PET_SIZES = ["P", "M", "G"] as const;
export type PetSizeCode = (typeof PET_SIZES)[number];

/** P até 10 kg · M de 10 a 25 kg · G acima de 25 kg (10 kg é P; 25 kg é M). */
export function sizeFromWeight(weightKg: number): PetSizeCode {
  if (weightKg <= 10) return "P";
  if (weightKg <= 25) return "M";
  return "G";
}

/** Data local "yyyy-MM-dd" + minutos desde 00:00 em São Paulo → instante UTC. */
export function saoPauloDateTime(localDate: string, minutesOfDay: number): Date {
  const [year, month, day] = localDate.split("-").map(Number);
  const utcMs =
    Date.UTC(year, month - 1, day, 0, minutesOfDay) -
    SAO_PAULO_UTC_OFFSET_MINUTES * 60_000;
  return new Date(utcMs);
}

/** Instante → data local "yyyy-MM-dd" em São Paulo. */
export function toSaoPauloDate(instant: Date): string {
  const local = new Date(instant.getTime() + SAO_PAULO_UTC_OFFSET_MINUTES * 60_000);
  return local.toISOString().slice(0, 10);
}

/** Dia da semana (0 = domingo) de uma data local "yyyy-MM-dd". */
export function weekdayOf(localDate: string): number {
  const [year, month, day] = localDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** Soma dias a uma data local "yyyy-MM-dd". */
export function addDaysToDate(localDate: string, days: number): string {
  const [year, month, day] = localDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

/** Rótulos dos portes para a interface. */
export const PET_SIZE_LABELS: Record<PetSizeCode, { name: string; range: string }> = {
  P: { name: "Pequeno", range: "até 10 kg" },
  M: { name: "Médio", range: "de 10 a 25 kg" },
  G: { name: "Grande", range: "acima de 25 kg" },
};
