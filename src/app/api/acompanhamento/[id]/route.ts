import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Etapa atual de um atendimento, consultada pela área do tutor a cada 30 s.
 * Só o dono do agendamento recebe a resposta; para qualquer outro usuário o recurso "não existe" (404),
 * sem revelar se o id é válido.
 */
export async function GET(_request: Request, context: RouteContext<"/api/acompanhamento/[id]">) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ erro: "Faça login para acompanhar o atendimento." }, { status: 401, headers: NO_STORE });
  }

  const { id } = await context.params;
  const appointment =
    id.length <= 40
      ? await prisma.appointment.findFirst({
          where: { id, userId: session.user.id },
          select: { status: true, groomingStage: true, stageUpdatedAt: true },
        })
      : null;
  if (!appointment) {
    return Response.json({ erro: "Agendamento não encontrado." }, { status: 404, headers: NO_STORE });
  }

  return Response.json(
    {
      status: appointment.status,
      etapa: appointment.groomingStage,
      atualizadoEm: appointment.stageUpdatedAt?.toISOString() ?? null,
    },
    { headers: NO_STORE },
  );
}
