"use server";

import { refresh } from "next/cache";

import { auth } from "@/auth";
import { CANCELLATION_MIN_HOURS, sizeFromWeight, toSaoPauloDate } from "@/lib/business-rules";
import { prisma } from "@/lib/prisma";
import { appointmentIdSchema, petSchema, vaccineSchema } from "@/lib/validation/account";

export type ActionResult = { ok: true; message: string } | { ok: false; message: string };

const LOGIN_REQUIRED: ActionResult = { ok: false, message: "Sua sessão expirou. Entre de novo." };

async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function createPetAction(input: unknown): Promise<ActionResult> {
  const userId = await currentUserId();
  if (!userId) return LOGIN_REQUIRED;

  const parsed = petSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  const { birthDate, ...pet } = parsed.data;

  if (birthDate && birthDate > toSaoPauloDate(new Date())) {
    return { ok: false, message: "A data de nascimento não pode ser no futuro." };
  }

  await prisma.pet.create({
    data: {
      ...pet,
      ownerId: userId,
      size: sizeFromWeight(pet.weightKg),
      birthDate: birthDate ? new Date(`${birthDate}T00:00:00Z`) : null,
    },
  });
  refresh();
  return { ok: true, message: `${pet.name} foi cadastrado(a)!` };
}

export async function addVaccineAction(input: unknown): Promise<ActionResult> {
  const userId = await currentUserId();
  if (!userId) return LOGIN_REQUIRED;

  const parsed = vaccineSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  const { petId, name, appliedAt, validUntil } = parsed.data;

  if (appliedAt > toSaoPauloDate(new Date())) {
    return { ok: false, message: "A data de aplicação não pode ser no futuro." };
  }

  // Só adiciona vacina em pet do próprio usuário.
  const pet = await prisma.pet.findFirst({ where: { id: petId, ownerId: userId }, select: { id: true } });
  if (!pet) return { ok: false, message: "Pet não encontrado." };

  await prisma.vaccine.create({
    data: {
      petId: pet.id,
      name,
      appliedAt: new Date(`${appliedAt}T00:00:00Z`),
      validUntil: new Date(`${validUntil}T00:00:00Z`),
    },
  });
  refresh();
  return { ok: true, message: `Vacina ${name} registrada.` };
}

/**
 * Cancela só se: o agendamento é do usuário, ainda está AGENDADO e faltam 24h ou mais.
 * As três condições ficam no WHERE de um único UPDATE: atômico, sem janela entre checar e gravar.
 */
export async function cancelAppointmentAction(id: unknown): Promise<ActionResult> {
  const userId = await currentUserId();
  if (!userId) return LOGIN_REQUIRED;

  const parsed = appointmentIdSchema.safeParse(id);
  if (!parsed.success) return { ok: false, message: "Agendamento não encontrado." };

  const now = new Date();
  const limit = new Date(now.getTime() + CANCELLATION_MIN_HOURS * 60 * 60 * 1000);
  const { count } = await prisma.appointment.updateMany({
    where: { id: parsed.data, userId, status: "AGENDADO", startAt: { gte: limit } },
    data: { status: "CANCELADO", cancelledAt: now },
  });

  if (count === 0) {
    const existing = await prisma.appointment.findFirst({
      where: { id: parsed.data, userId },
      select: { status: true },
    });
    if (!existing) return { ok: false, message: "Agendamento não encontrado." };
    if (existing.status !== "AGENDADO") return { ok: false, message: "Este agendamento não pode mais ser cancelado." };
    return {
      ok: false,
      message: "Cancelamentos só até 24h antes. Fale com a gente pelo WhatsApp.",
    };
  }

  refresh();
  return { ok: true, message: "Agendamento cancelado. O horário foi liberado." };
}
