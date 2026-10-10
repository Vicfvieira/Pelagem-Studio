/**
 * Regras da área do tutor. Funções puras (recebem "agora"/"hoje"), testadas em rules.test.ts.
 */
import { CANCELLATION_MIN_HOURS, NEXT_BATH_DAYS, addDaysToDate } from "@/lib/business-rules";

const HOUR_MS = 60 * 60 * 1000;

/** Serviços que contam como "banho" para a sugestão do próximo banho (a tosa completa inclui banho). */
export const BATH_SERVICE_SLUGS = ["banho", "banho-tosa-higienica", "tosa-completa"] as const;

/** Cancelamento permitido até 24h antes do início (inclusive). */
export function canCancel(startAt: Date, now: Date): boolean {
  return startAt.getTime() - now.getTime() >= CANCELLATION_MIN_HOURS * HOUR_MS;
}

/** Vacina vence em até 30 dias: hora de agendar o reforço. */
export const VACCINE_WARNING_DAYS = 30;

export type VaccineStatus = { status: "VENCIDA" | "VENCE_EM_BREVE" | "EM_DIA"; daysLeft: number };

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / (24 * HOUR_MS));
}

/** `validUntil` e `today` são datas locais "yyyy-MM-dd". Vence NO dia ainda conta como em dia (vence hoje). */
export function vaccineStatus(validUntil: string, today: string): VaccineStatus {
  const daysLeft = daysBetween(today, validUntil);
  if (daysLeft < 0) return { status: "VENCIDA", daysLeft };
  if (daysLeft <= VACCINE_WARNING_DAYS) return { status: "VENCE_EM_BREVE", daysLeft };
  return { status: "EM_DIA", daysLeft };
}

export type NextBathSuggestion =
  | { status: "SEM_HISTORICO" }
  | { status: "JA_AGENDADO"; scheduledDate: string }
  | { status: "EM_DIA" | "ATRASADO"; suggestedDate: string; lastBathDate: string };

/**
 * Próximo banho sugerido: 15 dias após o último banho CONCLUÍDO.
 * Se já existe um banho agendado no futuro, não sugere outro.
 */
export function suggestNextBath(input: {
  lastCompletedBathDate: string | null;
  nextScheduledBathDate: string | null;
  today: string;
}): NextBathSuggestion {
  if (input.nextScheduledBathDate) return { status: "JA_AGENDADO", scheduledDate: input.nextScheduledBathDate };
  if (!input.lastCompletedBathDate) return { status: "SEM_HISTORICO" };

  const suggestedDate = addDaysToDate(input.lastCompletedBathDate, NEXT_BATH_DAYS);
  return {
    status: suggestedDate < input.today ? "ATRASADO" : "EM_DIA",
    suggestedDate,
    lastBathDate: input.lastCompletedBathDate,
  };
}
