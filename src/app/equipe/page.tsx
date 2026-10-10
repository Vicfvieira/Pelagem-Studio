import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AdvanceStageButton } from "@/components/staff/advance-stage-button";
import { getAdmin } from "@/lib/auth/session";
import { toSaoPauloTime } from "@/lib/business-rules";
import { prisma } from "@/lib/prisma";
import { STAGE_INFO, nextStage, todayRange } from "@/lib/tracking/stages";

export const metadata: Metadata = { title: "Painel da equipe", robots: { index: false, follow: false } };

async function StaffBoard() {
  const admin = await getAdmin();
  // Para quem não é admin, a rota simplesmente não existe.
  if (!admin) notFound();

  const day = todayRange(new Date());
  const appointments = await prisma.appointment.findMany({
    where: { status: "AGENDADO", startAt: { gte: day.start, lt: day.end } },
    orderBy: { startAt: "asc" },
    select: {
      id: true,
      startAt: true,
      groomingStage: true,
      pet: { select: { name: true, breed: true } },
      service: { select: { slug: true, name: true } },
    },
  });

  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">Atendimentos de hoje</h1>
        <p className="text-muted-foreground">
          Olá, {admin.name.split(" ")[0]}. Cada clique avança uma etapa; o tutor vê a mudança em até 30 segundos.
        </p>
      </header>
      {appointments.length === 0 ? (
        <p className="rounded-2xl border bg-card p-6">Nenhum atendimento ativo hoje.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {appointments.map((a) => {
            const next = nextStage(a.service.slug, a.groomingStage);
            return (
              <li key={a.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-extrabold">
                    {toSaoPauloTime(a.startAt)} · {a.pet.name}{" "}
                    <span className="font-semibold text-muted-foreground">({a.pet.breed})</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {a.service.name} · Etapa atual:{" "}
                    <strong className="text-foreground">
                      {a.groomingStage ? STAGE_INFO[a.groomingStage].label : "Aguardando chegada"}
                    </strong>
                  </p>
                </div>
                <AdvanceStageButton
                  appointmentId={a.id}
                  expectedStage={a.groomingStage}
                  label={next ? `Marcar “${STAGE_INFO[next].label}”` : "Marcar como entregue"}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default function StaffPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-8 px-4 py-10">
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" aria-hidden="true" />}>
        <StaffBoard />
      </Suspense>
    </div>
  );
}
