/**
 * Motor de disponibilidade do Pelagem Studio.
 *
 * Função PURA: não acessa banco nem relógio. Quem chama informa o "agora" e os agendamentos
 * ativos (não cancelados) que podem cruzar o dia. Isso a torna determinística e fácil de testar,
 * e permite reutilizá-la tanto na API de consulta quanto na confirmação do agendamento.
 *
 * Regras:
 * - Funciona de terça a sábado, das 9h às 18h (horário de São Paulo), em slots de 30 min.
 * - Um atendimento ocupa todos os slots da sua duração e precisa terminar até o fechamento.
 * - Cada slot comporta no máximo SLOT_CAPACITY atendimentos simultâneos (2 banhistas).
 * - Não é possível agendar no passado nem com mais de MAX_DAYS_AHEAD dias de antecedência.
 */
import {
  CLOSE_MINUTE,
  MAX_DAYS_AHEAD,
  OPEN_MINUTE,
  OPEN_WEEKDAYS,
  SLOT_CAPACITY,
  SLOT_MINUTES,
  addDaysToDate,
  saoPauloDateTime,
  toSaoPauloDate,
  weekdayOf,
} from "@/lib/business-rules";

export type BusyInterval = { startAt: Date; endAt: Date };

export type UnavailableReason =
  | "DURACAO_INVALIDA"
  | "DIA_FECHADO"
  | "DATA_PASSADA"
  | "ALEM_DO_LIMITE";

export type AvailableSlot = {
  /** Início em ISO 8601 (UTC). */
  startAt: string;
  endAt: string;
  /** Horário local de São Paulo, "HH:mm". */
  time: string;
  /** Vagas restantes no slot mais ocupado do intervalo (1 ou 2). */
  remaining: number;
};

export type AvailabilityResult = {
  slots: AvailableSlot[];
  /** Motivo de o dia inteiro estar indisponível; null quando o dia é válido (mesmo que lotado). */
  reason: UnavailableReason | null;
};

export type GetAvailableSlotsInput = {
  /** Data local de São Paulo, "yyyy-MM-dd". */
  date: string;
  durationMinutes: number;
  /** Agendamentos ATIVOS (status diferente de CANCELADO) que podem cruzar a data. */
  appointments: readonly BusyInterval[];
  now: Date;
};

const MINUTE_MS = 60_000;

function formatTime(minutesOfDay: number): string {
  const hours = String(Math.floor(minutesOfDay / 60)).padStart(2, "0");
  const minutes = String(minutesOfDay % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/** Quantos agendamentos cruzam o intervalo [start, end). Funciona mesmo com horários desalinhados. */
function countOverlaps(appointments: readonly BusyInterval[], start: number, end: number): number {
  let count = 0;
  for (const appointment of appointments) {
    if (appointment.startAt.getTime() < end && appointment.endAt.getTime() > start) count++;
  }
  return count;
}

export function getAvailableSlots({
  date,
  durationMinutes,
  appointments,
  now,
}: GetAvailableSlotsInput): AvailabilityResult {
  const openMinutes = CLOSE_MINUTE - OPEN_MINUTE;
  if (
    !Number.isInteger(durationMinutes) ||
    durationMinutes <= 0 ||
    durationMinutes % SLOT_MINUTES !== 0 ||
    durationMinutes > openMinutes
  ) {
    return { slots: [], reason: "DURACAO_INVALIDA" };
  }

  if (!OPEN_WEEKDAYS.includes(weekdayOf(date))) return { slots: [], reason: "DIA_FECHADO" };

  const today = toSaoPauloDate(now);
  if (date < today) return { slots: [], reason: "DATA_PASSADA" };
  if (date > addDaysToDate(today, MAX_DAYS_AHEAD)) return { slots: [], reason: "ALEM_DO_LIMITE" };

  const slots: AvailableSlot[] = [];
  const lastStart = CLOSE_MINUTE - durationMinutes;

  for (let startMinute = OPEN_MINUTE; startMinute <= lastStart; startMinute += SLOT_MINUTES) {
    const startAt = saoPauloDateTime(date, startMinute);
    // Horários de hoje que já começaram ficam de fora.
    if (startAt.getTime() <= now.getTime()) continue;

    let remaining = SLOT_CAPACITY;
    for (let offset = 0; offset < durationMinutes; offset += SLOT_MINUTES) {
      const slotStart = startAt.getTime() + offset * MINUTE_MS;
      const used = countOverlaps(appointments, slotStart, slotStart + SLOT_MINUTES * MINUTE_MS);
      remaining = Math.min(remaining, SLOT_CAPACITY - used);
      if (remaining <= 0) break;
    }
    if (remaining <= 0) continue;

    slots.push({
      startAt: startAt.toISOString(),
      endAt: new Date(startAt.getTime() + durationMinutes * MINUTE_MS).toISOString(),
      time: formatTime(startMinute),
      remaining,
    });
  }

  return { slots, reason: null };
}

/** Atalho para a confirmação do agendamento: o início pedido está entre os horários livres? */
export function isSlotAvailable(input: GetAvailableSlotsInput & { startAt: Date }): boolean {
  const iso = input.startAt.toISOString();
  return getAvailableSlots(input).slots.some((slot) => slot.startAt === iso);
}
