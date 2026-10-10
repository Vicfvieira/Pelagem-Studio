import type { AppointmentStatus, PetSize } from "@prisma/client";

import {
  CLOSE_MINUTE,
  OPEN_MINUTE,
  OPEN_WEEKDAYS,
  SLOT_CAPACITY,
  addDaysToDate,
  weekdayOf,
} from "@/lib/business-rules";

export type SummaryRow = {
  userId: string;
  status: AppointmentStatus;
  size: PetSize;
  durationMinutes: number;
  totalCents: number;
  taxiFeeCents: number;
  service: { slug: string; name: string };
};

export type Summary = {
  periodo: { desde: string; ate: string };
  totalAgendamentos: number;
  porStatus: Record<AppointmentStatus, number>;
  /** Cancelados / total, de 0 a 1. */
  taxaCancelamento: number;
  /** Soma dos atendimentos CONCLUÍDOS (serviço + táxi). */
  receitaCentavos: number;
  /** Soma dos atendimentos ainda AGENDADOS no período. */
  receitaPrevistaCentavos: number;
  ticketMedioCentavos: number;
  /** Clientes distintos com atendimento não cancelado. */
  clientesUnicos: number;
  porServico: Array<{ slug: string; nome: string; quantidade: number; receitaCentavos: number }>;
  porPorte: Record<PetSize, number>;
  taxiDog: { quantidade: number; receitaCentavos: number };
  ocupacao: { horasAtendidas: number; horasDisponiveis: number; percentual: number };
};

const round = (value: number, digits: number) => Math.round(value * 10 ** digits) / 10 ** digits;

/** Dias de funcionamento entre duas datas locais (inclusivas). */
export function openDaysBetween(desde: string, ate: string): number {
  let count = 0;
  for (let day = desde; day <= ate; day = addDaysToDate(day, 1)) {
    if (OPEN_WEEKDAYS.includes(weekdayOf(day))) count++;
  }
  return count;
}

/**
 * Indicadores do período. Função pura: recebe as linhas já filtradas pelo período.
 * Cancelados contam no total e na taxa de cancelamento, mas não em receita, ocupação ou clientes.
 */
export function summarize(rows: readonly SummaryRow[], periodo: { desde: string; ate: string }): Summary {
  const porStatus: Record<AppointmentStatus, number> = { AGENDADO: 0, CONCLUIDO: 0, CANCELADO: 0 };
  const porPorte: Record<PetSize, number> = { P: 0, M: 0, G: 0 };
  const services = new Map<string, { slug: string; nome: string; quantidade: number; receitaCentavos: number }>();
  const clients = new Set<string>();
  let receita = 0;
  let receitaPrevista = 0;
  let minutosAtendidos = 0;
  const taxi = { quantidade: 0, receitaCentavos: 0 };

  for (const row of rows) {
    porStatus[row.status]++;
    if (row.status === "CANCELADO") continue;

    clients.add(row.userId);
    porPorte[row.size]++;
    minutosAtendidos += row.durationMinutes;

    const service = services.get(row.service.slug) ?? {
      slug: row.service.slug,
      nome: row.service.name,
      quantidade: 0,
      receitaCentavos: 0,
    };
    service.quantidade++;
    if (row.taxiFeeCents > 0) taxi.quantidade++;

    if (row.status === "CONCLUIDO") {
      receita += row.totalCents;
      service.receitaCentavos += row.totalCents;
      taxi.receitaCentavos += row.taxiFeeCents;
    } else {
      receitaPrevista += row.totalCents;
    }
    services.set(row.service.slug, service);
  }

  const horasDisponiveis =
    (openDaysBetween(periodo.desde, periodo.ate) * (CLOSE_MINUTE - OPEN_MINUTE) * SLOT_CAPACITY) / 60;
  const horasAtendidas = minutosAtendidos / 60;

  return {
    periodo,
    totalAgendamentos: rows.length,
    porStatus,
    taxaCancelamento: rows.length ? round(porStatus.CANCELADO / rows.length, 4) : 0,
    receitaCentavos: receita,
    receitaPrevistaCentavos: receitaPrevista,
    ticketMedioCentavos: porStatus.CONCLUIDO ? Math.round(receita / porStatus.CONCLUIDO) : 0,
    clientesUnicos: clients.size,
    porServico: [...services.values()].sort((a, b) => b.quantidade - a.quantidade || a.slug.localeCompare(b.slug)),
    porPorte,
    taxiDog: taxi,
    ocupacao: {
      horasAtendidas: round(horasAtendidas, 1),
      horasDisponiveis,
      percentual: horasDisponiveis ? round(horasAtendidas / horasDisponiveis, 4) : 0,
    },
  };
}
