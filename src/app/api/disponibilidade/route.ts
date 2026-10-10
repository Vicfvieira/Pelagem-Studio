import type { NextRequest } from "next/server";
import { z } from "zod";

import { addDaysToDate, saoPauloDateTime } from "@/lib/business-rules";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots, type UnavailableReason } from "@/lib/scheduling";
import { availabilityQuerySchema } from "@/lib/validation/availability";

const REASON_MESSAGES: Record<UnavailableReason, string> = {
  DURACAO_INVALIDA: "Este serviço está com a duração mal configurada.",
  DIA_FECHADO: "Funcionamos de terça a sábado.",
  DATA_PASSADA: "Escolha uma data a partir de hoje.",
  ALEM_DO_LIMITE: "Agendamentos podem ser feitos com até 30 dias de antecedência.",
};

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * GET /api/disponibilidade?data=2026-10-14&servico=banho&porte=M
 *
 * A duração NUNCA vem do cliente: é lida do banco a partir de serviço + porte.
 * Sem cache: a disponibilidade muda a cada novo agendamento.
 */
export async function GET(request: NextRequest) {
  const parsed = availabilityQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return Response.json(
      { erro: "Parâmetros inválidos.", campos: z.flattenError(parsed.error).fieldErrors },
      { status: 400, headers: NO_STORE },
    );
  }
  const { data, servico, porte } = parsed.data;

  const price = await prisma.servicePrice.findFirst({
    where: { size: porte, service: { slug: servico, active: true } },
    select: { durationMinutes: true, priceCents: true },
  });
  if (!price) {
    return Response.json({ erro: "Serviço não encontrado." }, { status: 404, headers: NO_STORE });
  }

  // Agendamentos ativos que cruzam o dia (em São Paulo) pedido.
  const dayStart = saoPauloDateTime(data, 0);
  const dayEnd = saoPauloDateTime(addDaysToDate(data, 1), 0);
  const appointments = await prisma.appointment.findMany({
    where: { status: { not: "CANCELADO" }, startAt: { lt: dayEnd }, endAt: { gt: dayStart } },
    select: { startAt: true, endAt: true },
  });

  const { slots, reason } = getAvailableSlots({
    date: data,
    durationMinutes: price.durationMinutes,
    appointments,
    now: new Date(),
  });

  return Response.json(
    {
      data,
      servico,
      porte,
      duracaoMinutos: price.durationMinutes,
      precoCentavos: price.priceCents,
      motivo: reason,
      mensagem: reason ? REASON_MESSAGES[reason] : slots.length === 0 ? "Dia lotado. Tente outra data." : null,
      horarios: slots.map((slot) => ({
        inicio: slot.startAt,
        fim: slot.endAt,
        hora: slot.time,
        vagas: slot.remaining,
      })),
    },
    { headers: NO_STORE },
  );
}
