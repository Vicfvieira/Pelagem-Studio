import { BadgeCheck, CalendarX, Home, Syringe } from "lucide-react";

import { Doodle } from "@/components/home/doodles";
import { Reveal } from "@/components/motion";
import { CANCELLATION_MIN_HOURS, SLOT_CAPACITY } from "@/lib/business-rules";
import { cn } from "@/lib/utils";

/** Manhã ilustrativa de terça: cada faixa é um banhista; blocos = atendimentos (duração real do catálogo). */
const MORNING = [
  { lane: 0, start: 0, slots: 2, label: "Banho · P" },
  { lane: 0, start: 2, slots: 4, label: "Tosa completa · P" },
  { lane: 1, start: 0, slots: 3, label: "Banho · G" },
  { lane: 1, start: 4, slots: 2, label: "Hidratação · M" },
] as const;

const FEATURES = [
  {
    icon: Home,
    title: "Sem gaiolas",
    text: "Cada pet fica com um banhista do início ao fim. Ninguém espera trancado.",
  },
  {
    icon: BadgeCheck,
    title: "Equipe certificada",
    text: "Formação em comportamento animal e cuidados com braquicefálicos.",
  },
  {
    icon: Syringe,
    title: "Vacinas em dia",
    text: "Carteirinha digital com alerta antes de cada vacina vencer.",
  },
  {
    icon: CalendarX,
    title: `Cancele até ${CANCELLATION_MIN_HOURS}h antes`,
    text: "Pelo site, sem custo e sem precisar ligar.",
  },
] as const;

/** "Por que escolher": cartão grande com a agenda (a regra de capacidade) + 4 diferenciais. */
export function WhyChoose() {
  return (
    <section aria-labelledby="por-que-titulo" className="bg-card">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <h2 id="por-que-titulo" className="text-3xl font-black sm:text-4xl">
            Por que escolher o <span className="text-primary-display">Pelagem</span>?
          </h2>
          <p className="max-w-lg text-muted-foreground">Pequeno de propósito, organizado de verdade.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <Reveal className="relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-primary p-7 sm:p-9">
            <Doodle kind="heart" className="absolute top-6 right-8 size-10 rotate-12 text-foreground/60" />
            <p className="text-xs font-black tracking-[0.18em] uppercase">Agenda sem fila</p>
            <h3 className="max-w-sm text-3xl leading-tight font-black sm:text-4xl">
              No máximo {SLOT_CAPACITY} pets por horário. Nunca 3.
            </h3>
            <p className="max-w-md">
              Cada atendimento ocupa todos os horários da sua duração, e o agendamento online não deixa passar disso.
            </p>
            <figure className="mt-auto rounded-2xl bg-card p-4 text-foreground shadow-sm">
              <div aria-hidden="true" className="flex flex-col gap-2">
                <div className="grid grid-cols-6 text-[11px] font-bold text-muted-foreground">
                  {["9h", "10h", "11h"].map((hour) => (
                    <span key={hour} className="col-span-2">
                      {hour}
                    </span>
                  ))}
                </div>
                {[0, 1].map((lane) => (
                  <div key={lane} className="grid h-9 grid-cols-6 gap-1">
                    {MORNING.filter((block) => block.lane === lane).map((block) => (
                      <span
                        key={block.label}
                        className={cn(
                          "flex items-center truncate rounded-lg px-2 text-[11px] font-extrabold",
                          lane === 0 ? "bg-secondary" : "bg-accent",
                        )}
                        style={{ gridColumn: `${block.start + 1} / span ${block.slots}` }}
                      >
                        {block.label}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <figcaption className="mt-3 text-xs text-muted-foreground">
                Manhã de terça: uma faixa por banhista, blocos de 30 min.
              </figcaption>
            </figure>
          </Reveal>

          <ul className="grid gap-5 sm:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <Reveal as="li" key={feature.title} delay={index * 0.06}>
                <article className="flex h-full flex-col gap-3 rounded-3xl border bg-background p-6 transition-transform duration-300 hover:-translate-y-1">
                  <span className="grid size-12 place-items-center rounded-2xl bg-secondary/30" aria-hidden="true">
                    <feature.icon className="size-6 text-secondary-strong" />
                  </span>
                  <h3 className="text-lg font-black">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.text}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
