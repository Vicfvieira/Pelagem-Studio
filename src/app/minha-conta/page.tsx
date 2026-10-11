import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CalendarClock, LogOut, PawPrint, Radio, Syringe } from "lucide-react";

import { AddPetForm } from "@/components/account/add-pet-form";
import { AppointmentList } from "@/components/account/appointment-list";
import { BathTracker } from "@/components/account/bath-tracker";
import { NextBathCard } from "@/components/account/next-bath-card";
import { PetCard } from "@/components/account/pet-card";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/session";
import { getAccountOverview } from "@/lib/data/account";

export const metadata: Metadata = { title: "Minha conta", robots: { index: false, follow: false } };

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="flex scroll-mt-20 flex-col gap-4">
      <h2 id={`${id}-titulo`} className="text-2xl font-black tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

async function AccountContent() {
  const user = await requireUser("/minha-conta");
  const { pets, today, upcoming, history, historyTotal, vaccineAlerts } = await getAccountOverview(user.id);
  const firstName = user.name?.split(" ")[0] ?? "tutor(a)";

  const summary = [
    ...(today.length > 0
      ? [{ href: "#acompanhe", icon: Radio, label: `${today.length} atendimento${today.length === 1 ? "" : "s"} hoje` }]
      : []),
    {
      href: "#agendamentos",
      icon: CalendarClock,
      label: `${upcoming.length} próximo${upcoming.length === 1 ? "" : "s"}`,
    },
    {
      href: "#pets",
      icon: Syringe,
      label:
        vaccineAlerts > 0
          ? `${vaccineAlerts} vacina${vaccineAlerts === 1 ? "" : "s"} pedindo atenção`
          : "Vacinas em dia",
      alert: vaccineAlerts > 0,
    },
    { href: "#pets", icon: PawPrint, label: `${pets.length} pet${pets.length === 1 ? "" : "s"}` },
  ];

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-[family-name:var(--font-fraunces)] text-2xl font-black">Olá, {firstName}!</p>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="outline">
            <LogOut aria-hidden="true" /> Sair
          </Button>
        </form>
      </header>

      <nav aria-label="Resumo da conta">
        <ul className="flex flex-wrap gap-2">
          {summary.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 ${
                  item.alert ? "bg-destructive/10 text-destructive" : "bg-muted"
                }`}
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {today.length > 0 && (
        <Section id="acompanhe" title="Acompanhe o banho">
          <ul className="grid gap-4 lg:grid-cols-2">
            {today.map((appointment) => (
              <li key={appointment.id}>
                <BathTracker appointment={appointment} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {pets.length === 0 ? (
        <Section id="pets" title="Comece cadastrando seu pet">
          <p className="text-muted-foreground">
            Com o pet cadastrado você agenda em poucos cliques e acompanha as vacinas.
          </p>
          <AddPetForm startOpen />
        </Section>
      ) : (
        <Section id="proximo-banho" title="Próximo banho">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <li key={pet.id}>
                <NextBathCard pet={pet} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="agendamentos" title="Próximos agendamentos">
        {upcoming.length > 0 ? (
          <AppointmentList items={upcoming} mode="upcoming" />
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-5">
            <p className="text-muted-foreground">Nenhum agendamento marcado.</p>
            {pets.length > 0 && (
              <Button asChild>
                <Link href="/agendar">Agendar agora</Link>
              </Button>
            )}
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Cancelamentos pelo site até 24h antes do horário. Os atendimentos de hoje aparecem em “Acompanhe o banho”.
        </p>
      </Section>

      {pets.length > 0 && (
        <Section id="pets" title="Meus pets">
          <AddPetForm />
          <ul className="grid gap-4 lg:grid-cols-2">
            {pets.map((pet) => (
              <li key={pet.id}>
                <PetCard pet={pet} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="historico" title="Histórico">
        {history.length > 0 ? (
          <>
            <AppointmentList items={history} mode="history" />
            {historyTotal > history.length && (
              <p className="text-sm text-muted-foreground">
                Mostrando os {history.length} mais recentes de {historyTotal} atendimentos.
              </p>
            )}
          </>
        ) : (
          <p className="text-muted-foreground">Seu histórico aparece aqui depois do primeiro atendimento.</p>
        )}
      </Section>
    </>
  );
}

/** Topo com as proporções da página real e altura mínima de uma tela: o rodapé começa fora da
 * área visível, então não "pula" quando o conteúdo chega (CLS). */
function AccountSkeleton() {
  return (
    <div className="flex min-h-svh animate-pulse flex-col gap-10 motion-reduce:animate-none" aria-hidden="true">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-48 rounded-2xl bg-muted" />
        <div className="h-5 w-44 rounded bg-muted" />
      </div>
      <div className="flex gap-2">
        <div className="h-11 w-32 rounded-full bg-muted" />
        <div className="h-11 w-44 rounded-full bg-muted" />
        <div className="h-11 w-20 rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-44 rounded-2xl bg-muted" />
        <div className="h-44 rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 md:py-14">
      {/* Cabeçalho fora do Suspense: vai no HTML estático e é pintado de imediato (LCP), antes dos dados. */}
      <header className="flex flex-col gap-2">
        <p className="w-fit rounded-full border bg-card px-4 py-1.5 text-sm font-bold text-primary-strong">
          Área do tutor
        </p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Minha conta</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          O banho de hoje ao vivo, os próximos horários, a carteirinha de vacinas e o histórico de cada pet.
        </p>
      </header>
      <Suspense fallback={<AccountSkeleton />}>
        <AccountContent />
      </Suspense>
    </div>
  );
}
