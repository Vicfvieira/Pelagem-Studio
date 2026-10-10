import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Eye, Leaf } from "lucide-react";

import { PageHeader } from "@/components/content/page-header";
import { StatsBand } from "@/components/content/stats-band";
import { TeamAvatar } from "@/components/content/team-avatar";
import { Timeline } from "@/components/content/timeline";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { MISSION, TEAM, TIMELINE, VALUES } from "@/content/company";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "Fundado em 2019 na Vila Mariana e hoje na Vila Madalena: conheça a história, a missão e a equipe do Pelagem Studio.",
  alternates: { canonical: "/sobre" },
};

const VALUE_ICONS = [Heart, Eye, Leaf] as const;

export default function AboutPage() {
  return (
    <>
      <section aria-labelledby="sobre-titulo" className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 md:py-16">
        <PageHeader id="sobre-titulo" eyebrow={`Desde ${SITE.foundedYear} em São Paulo`} title="Um estúdio pequeno de propósito">
          <p>
            O Pelagem Studio nasceu em março de {SITE.foundedYear}, numa sala de 40 m² na Vila Mariana, com uma
            banheira e uma regra: um pet de cada vez, sem pressa. Hoje estamos na {SITE.address.neighborhood}, com
            dois boxes de banho, e a regra continua quase a mesma: no máximo dois.
          </p>
        </PageHeader>

        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <Reveal className="flex flex-col justify-center gap-4 rounded-2xl bg-primary p-8 md:p-10">
            <h2 className="text-sm font-extrabold tracking-wide uppercase">Nossa missão</h2>
            <p className="font-[family-name:var(--font-fraunces)] text-2xl leading-snug font-bold sm:text-3xl">{MISSION}</p>
          </Reveal>
          <ul className="flex flex-col gap-4">
            {VALUES.map((value, index) => {
              const Icon = VALUE_ICONS[index];
              return (
                <Reveal as="li" key={value.title} delay={index * 0.08} className="flex gap-4 rounded-2xl border bg-card p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary/25" aria-hidden="true">
                    <Icon className="size-5 text-secondary-strong" />
                  </span>
                  <div>
                    <h3 className="text-lg font-black">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <StatsBand />

      <section aria-labelledby="historia-titulo" className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-16">
        <div className="flex flex-col gap-2">
          <h2 id="historia-titulo" className="text-3xl font-black tracking-tight sm:text-4xl">
            Nossa história, ano a ano
          </h2>
          <p className="text-muted-foreground">Clique nos anos ou use as setas do teclado.</p>
        </div>
        <Timeline events={TIMELINE} />
      </section>

      <section aria-labelledby="equipe-titulo" className="bg-muted/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
          <div className="flex max-w-2xl flex-col gap-2">
            <h2 id="equipe-titulo" className="text-3xl font-black tracking-tight sm:text-4xl">
              Quem cuida do seu pet
            </h2>
            <p className="text-muted-foreground">
              Cinco pessoas, dois banhistas por horário. Todo mundo aqui conhece seu pet pelo nome.
            </p>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member, index) => (
              <Reveal as="li" key={member.name} delay={(index % 3) * 0.08}>
                <article className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="size-20 shrink-0">
                      <TeamAvatar name={member.name} tone={member.tone} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{member.name}</h3>
                      <p className="text-sm font-bold text-primary-strong">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    <span className="font-bold">Especialidade:</span> {member.specialty}
                  </p>
                  <blockquote className="flex-1 border-l-4 border-secondary pl-4 text-muted-foreground italic">
                    “{member.quote}”
                  </blockquote>
                  <p className="text-xs font-semibold text-muted-foreground">No Pelagem desde {member.since}</p>
                </article>
              </Reveal>
            ))}
            <li className="flex flex-col justify-center gap-4 rounded-2xl border-2 border-dashed border-primary/50 p-6">
              <h3 className="text-xl font-black">Quer fazer parte?</h3>
              <p className="text-sm text-muted-foreground">
                Procuramos gente que gosta de bicho e tem paciência de sobra.
              </p>
              <Button asChild variant="outline" className="w-fit">
                <Link href="/trabalhe-conosco">Ver vagas</Link>
              </Button>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
