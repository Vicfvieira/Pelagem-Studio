import type { Metadata } from "next";
import { Bug, CalendarX, Car, Clock, PackageSearch, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/content/page-header";
import { CANCELLATION_MIN_HOURS, MAX_DAYS_AHEAD } from "@/lib/business-rules";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Políticas de atendimento",
  description:
    "Cancelamento, atrasos, pets agressivos, pulgas e carrapatos, táxi dog e objetos esquecidos: as regras do Pelagem Studio.",
  alternates: { canonical: "/politicas" },
};

const POLICIES = [
  {
    id: "cancelamento",
    icon: CalendarX,
    title: "Cancelamento e remarcação",
    paragraphs: [
      `Você cancela pela área do tutor até ${CANCELLATION_MIN_HOURS}h antes do horário, sem custo. Depois desse prazo, fale com a gente pelo WhatsApp: se der para encaixar outro pet, não cobramos nada.`,
      `Novos horários podem ser marcados com até ${MAX_DAYS_AHEAD} dias de antecedência. Depois de duas faltas sem aviso, pedimos um sinal de 50% para os próximos agendamentos.`,
    ],
  },
  {
    id: "atrasos",
    icon: Clock,
    title: "Atrasos",
    paragraphs: [
      "Toleramos até 15 minutos de atraso. Como atendemos no máximo dois pets por horário, um atraso maior empurra a agenda de outros tutores.",
      "Passados os 15 minutos, tentamos encaixar seu pet no mesmo dia. Se não houver horário, remarcamos sem custo na primeira vez.",
    ],
  },
  {
    id: "agressivos",
    icon: ShieldAlert,
    title: "Pets agressivos ou reativos",
    paragraphs: [
      "Avise no campo de observações do agendamento. Assim reservamos um horário mais tranquilo e o banhista mais experiente com manejo.",
      "Focinheira só se o pet já usa no dia a dia e com autorização do tutor. Não usamos sedação. Se houver risco para o pet ou para a equipe, interrompemos o atendimento e cobramos apenas o que foi feito.",
    ],
  },
  {
    id: "parasitas",
    icon: Bug,
    title: "Pulgas e carrapatos",
    paragraphs: [
      "Se encontrarmos parasitas, avisamos na hora e fazemos o banho com produto específico, sem custo extra na primeira vez. Na sequência, o box passa por higienização reforçada antes do próximo pet.",
      "Para proteger os outros pets, recomendamos que o tratamento antipulgas indicado pelo veterinário esteja em dia antes do próximo banho.",
    ],
  },
  {
    id: "taxi-dog",
    icon: Car,
    title: "Táxi dog",
    paragraphs: [
      "Atendemos só a cidade de São Paulo. A busca acontece numa janela de 30 minutos antes do horário marcado, e alguém maior de idade precisa entregar e receber o pet.",
      "Se ninguém atender na busca, o motorista espera 10 minutos e segue a rota. A taxa do táxi não é cobrada nesse caso.",
    ],
  },
  {
    id: "objetos",
    icon: PackageSearch,
    title: "Objetos esquecidos",
    paragraphs: [
      "Coleiras, guias, roupinhas e brinquedos esquecidos ficam guardados por 30 dias, identificados com o nome do pet. Depois disso, são doados para ONGs de proteção animal parceiras.",
    ],
  },
] as const;

export default function PoliciesPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 md:py-16">
      <PageHeader id="politicas-titulo" eyebrow="Regras combinadas" title="Políticas de atendimento">
        <p>Regras simples, pensadas para o seu pet e para os outros que estão na agenda.</p>
      </PageHeader>

      <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
        <nav aria-label="Nesta página" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col [scrollbar-width:none]">
            {POLICIES.map((policy) => (
              <li key={policy.id} className="shrink-0">
                <a
                  href={`#${policy.id}`}
                  className="flex min-h-11 items-center gap-2 rounded-full border bg-card px-4 text-sm font-bold whitespace-nowrap outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/60 lg:rounded-2xl"
                >
                  <policy.icon className="size-4 text-primary-strong" aria-hidden="true" />
                  {policy.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-col gap-6">
          {POLICIES.map((policy) => (
            <section
              key={policy.id}
              id={policy.id}
              aria-labelledby={`${policy.id}-titulo`}
              className="flex scroll-mt-24 flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm md:p-8"
            >
              <h2 id={`${policy.id}-titulo`} className="flex items-center gap-3 text-2xl font-black tracking-tight">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent" aria-hidden="true">
                  <policy.icon className="size-5 text-primary-strong" />
                </span>
                {policy.title}
              </h2>
              {policy.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
          <p className="text-sm text-muted-foreground">
            Dúvidas sobre alguma regra? Escreva para {SITE.email} ou chame no WhatsApp {SITE.phoneDisplay}.
          </p>
        </div>
      </div>
    </div>
  );
}
