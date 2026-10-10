import type { Metadata } from "next";
import { Suspense } from "react";

import { BookingWizard } from "@/components/booking/booking-wizard";
import { requireUser } from "@/lib/auth/session";
import {
  CLOSE_MINUTE,
  SLOT_MINUTES,
  addDaysToDate,
  toSaoPauloDate,
  toSaoPauloTime,
} from "@/lib/business-rules";
import { getServicesCatalog } from "@/lib/data/services";
import { prisma } from "@/lib/prisma";
import { petSizeSchema, serviceSlugSchema } from "@/lib/validation/availability";

export const metadata: Metadata = {
  title: "Agendar",
  description: "Agende banho, tosa e táxi dog em poucos passos.",
};

type SearchParams = PageProps<"/agendar">["searchParams"];

async function BookingContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
  }
  const user = await requireUser(query.size > 0 ? `/agendar?${query}` : "/agendar");

  const [pets, services] = await Promise.all([
    // Só os pets do usuário logado.
    prisma.pet.findMany({
      where: { ownerId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true, species: true, breed: true, size: true },
    }),
    getServicesCatalog(),
  ]);

  // Parâmetros vindos de /servicos: validados e usados só como sugestão inicial.
  const requestedService = serviceSlugSchema.safeParse(params.servico);
  const requestedSize = petSizeSchema.safeParse(params.porte);
  const initialService =
    requestedService.success && services.some((s) => s.slug === requestedService.data)
      ? requestedService.data
      : undefined;
  const initialPet =
    (requestedSize.success ? pets.find((p) => p.size === requestedSize.data) : undefined) ??
    (pets.length === 1 ? pets[0] : undefined);

  // Depois do último slot do dia (17h30), os atalhos de data começam amanhã.
  const now = new Date();
  const today = toSaoPauloDate(now);
  const [hours, minutes] = toSaoPauloTime(now).split(":").map(Number);
  const firstDay = hours * 60 + minutes >= CLOSE_MINUTE - SLOT_MINUTES ? addDaysToDate(today, 1) : today;

  return (
    <BookingWizard
      pets={pets}
      services={services}
      today={today}
      firstDay={firstDay}
      initialPetId={initialPet?.id}
      initialService={initialService}
    />
  );
}

/** Mesmas medidas do passo 1 do assistente, para o conteúdo não "pular" ao carregar (CLS). */
function WizardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-8 motion-reduce:animate-none" aria-hidden="true">
      <div className="flex flex-col gap-3">
        <div className="h-5 w-24 rounded bg-muted" />
        <div className="h-2 rounded-full bg-muted" />
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="size-8 rounded-full bg-muted" />
              <div className="hidden h-4 w-14 rounded bg-muted sm:block" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="h-8 w-2/3 rounded-2xl bg-muted" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-[84px] rounded-2xl bg-muted" />
          <div className="h-[84px] rounded-2xl bg-muted" />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="h-12 w-full rounded-2xl bg-primary/30 sm:w-40" />
      </div>
    </div>
  );
}

export default function BookingPage({ searchParams }: PageProps<"/agendar">) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 md:py-14">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">Agendar atendimento</h1>
        <p className="text-muted-foreground">Cinco passos rápidos. Você revisa tudo antes de confirmar.</p>
      </header>
      <Suspense fallback={<WizardSkeleton />}>
        <BookingContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
