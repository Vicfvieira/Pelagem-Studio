import { quoteTaxi, type TaxiQuote } from "@/lib/booking/taxi";
import { addDaysToDate, saoPauloDateTime } from "@/lib/business-rules";
import { prisma } from "@/lib/prisma";
import { isSlotAvailable } from "@/lib/scheduling";
import { bookingSchema, normalizeCep, type BookingInput } from "@/lib/validation/booking";

/** Namespace da trava consultiva do Postgres para a agenda (evita colisão com outras travas). */
const AGENDA_LOCK_NAMESPACE = 4201;

export type BookingSummary = {
  appointmentId: string;
  petName: string;
  serviceName: string;
  startAt: string;
  endAt: string;
  priceCents: number;
  taxiFeeCents: number;
  totalCents: number;
  taxiAddress: string | null;
};

export type BookingResult =
  | { ok: true; booking: BookingSummary }
  | { ok: false; message: string; field?: keyof BookingInput };

/**
 * Cria um agendamento confiando só no servidor:
 * - o pet precisa ser do usuário logado;
 * - porte, preço e duração vêm do banco (o porte é o do pet, não o que o cliente diz);
 * - a taxa do táxi é recalculada consultando o ViaCEP de novo;
 * - a disponibilidade é conferida DENTRO de uma transação com trava por dia, então dois pedidos
 *   simultâneos para o último horário livre nunca passam juntos da capacidade.
 */
export async function bookAppointment(userId: string, rawInput: unknown, now = new Date()): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(rawInput);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, message: issue?.message ?? "Dados inválidos.", field: issue?.path[0] as keyof BookingInput };
  }
  const input = parsed.data;

  const pet = await prisma.pet.findFirst({
    where: { id: input.petId, ownerId: userId },
    select: { id: true, name: true, size: true },
  });
  if (!pet) return { ok: false, message: "Pet não encontrado.", field: "petId" };

  const service = await prisma.service.findFirst({
    where: { slug: input.servico, active: true },
    select: {
      id: true,
      name: true,
      prices: { where: { size: pet.size }, select: { priceCents: true, durationMinutes: true } },
    },
  });
  const price = service?.prices[0];
  if (!service || !price) return { ok: false, message: "Serviço indisponível para este porte.", field: "servico" };

  let taxi: Extract<TaxiQuote, { ok: true }> | null = null;
  if (input.taxi) {
    const quote = await quoteTaxi(normalizeCep(input.cep ?? ""));
    if (!quote.ok) return { ok: false, message: quote.message, field: "cep" };
    taxi = quote;
  }

  const [hours, minutes] = input.hora.split(":").map(Number);
  const startAt = saoPauloDateTime(input.data, hours * 60 + minutes);
  const endAt = new Date(startAt.getTime() + price.durationMinutes * 60_000);
  const taxiFeeCents = taxi?.feeCents ?? 0;
  const taxiAddress = taxi
    ? `${taxi.street}, ${input.numero}${input.complemento ? ` - ${input.complemento}` : ""} - ${taxi.neighborhood}, São Paulo - SP`
    : null;

  return prisma.$transaction(async (tx) => {
    // Serializa os agendamentos do MESMO dia (atendimentos nunca cruzam a meia-noite).
    // A trava é liberada sozinha no fim da transação.
    const dayKey = Number(input.data.replaceAll("-", ""));
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${AGENDA_LOCK_NAMESPACE}::int, ${dayKey}::int)`;

    const appointments = await tx.appointment.findMany({
      where: {
        status: { not: "CANCELADO" },
        startAt: { lt: saoPauloDateTime(addDaysToDate(input.data, 1), 0) },
        endAt: { gt: saoPauloDateTime(input.data, 0) },
      },
      select: { petId: true, startAt: true, endAt: true },
    });

    const available = isSlotAvailable({
      date: input.data,
      durationMinutes: price.durationMinutes,
      appointments,
      now,
      startAt,
    });
    if (!available) {
      return {
        ok: false as const,
        message: "Esse horário não está mais disponível. Escolha outro, por favor.",
        field: "hora" as const,
      };
    }

    const petBusy = appointments.some((a) => a.petId === pet.id && a.startAt < endAt && a.endAt > startAt);
    if (petBusy) {
      return { ok: false as const, message: `${pet.name} já tem um atendimento nesse horário.`, field: "hora" as const };
    }

    const created = await tx.appointment.create({
      data: {
        userId,
        petId: pet.id,
        serviceId: service.id,
        size: pet.size,
        priceCents: price.priceCents,
        durationMinutes: price.durationMinutes,
        startAt,
        endAt,
        taxiZoneId: taxi?.zoneId ?? null,
        taxiCep: taxi?.cep ?? null,
        taxiAddress,
        taxiFeeCents,
        totalCents: price.priceCents + taxiFeeCents,
        notes: input.observacoes || null,
      },
      select: { id: true },
    });

    return {
      ok: true as const,
      booking: {
        appointmentId: created.id,
        petName: pet.name,
        serviceName: service.name,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        priceCents: price.priceCents,
        taxiFeeCents,
        totalCents: price.priceCents + taxiFeeCents,
        taxiAddress,
      },
    };
  });
}
