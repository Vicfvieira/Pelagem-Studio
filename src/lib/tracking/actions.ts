"use server";

import { refresh } from "next/cache";
import { z } from "zod";

import { getAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { STAGE_INFO, nextStage, todayRange } from "@/lib/tracking/stages";

export type StageActionResult = { ok: true; message: string } | { ok: false; message: string };

const inputSchema = z.object({
  appointmentId: z.string().min(1).max(40),
  /** Etapa que a pessoa estava vendo: evita avançar duas vezes com cliques repetidos ou duas abas. */
  expectedStage: z.enum(["RECEBIDO", "BANHO", "SECAGEM", "TOSA", "PRONTO"]).nullable(),
});

/**
 * Avança o atendimento de HOJE para a próxima etapa (só ADMIN). Depois de "Pronto para buscar",
 * o próximo passo é a entrega: o agendamento vira CONCLUIDO.
 * O UPDATE confere id, status, dia e etapa esperada no WHERE, então é atômico.
 */
export async function advanceStageAction(input: unknown): Promise<StageActionResult> {
  const admin = await getAdmin();
  if (!admin) return { ok: false, message: "Acesso restrito à equipe." };

  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Dados inválidos." };
  const { appointmentId, expectedStage } = parsed.data;

  const day = todayRange(new Date());
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, status: "AGENDADO", startAt: { gte: day.start, lt: day.end } },
    select: { groomingStage: true, service: { select: { slug: true } }, pet: { select: { name: true } } },
  });
  if (!appointment) return { ok: false, message: "Atendimento de hoje não encontrado." };

  const stale = { ok: false, message: "Outra pessoa da equipe já atualizou este atendimento." } as const;
  if (appointment.groomingStage !== expectedStage) return stale;
  const next = nextStage(appointment.service.slug, appointment.groomingStage);
  const where = {
    id: appointmentId,
    status: "AGENDADO" as const,
    groomingStage: expectedStage,
    startAt: { gte: day.start, lt: day.end },
  };
  const now = new Date();
  const { count } = await prisma.appointment.updateMany({
    where,
    data: next ? { groomingStage: next, stageUpdatedAt: now } : { status: "CONCLUIDO", stageUpdatedAt: now },
  });
  if (count === 0) return stale;

  refresh();
  return {
    ok: true,
    message: next ? `${appointment.pet.name}: ${STAGE_INFO[next].label}.` : `${appointment.pet.name} foi entregue.`,
  };
}
