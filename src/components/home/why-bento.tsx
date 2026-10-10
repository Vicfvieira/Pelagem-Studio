import Link from "next/link";
import { ArrowUpRight, Car, Leaf, Radio, Star, Wallet } from "lucide-react";

import { Reveal } from "@/components/motion";
import { STATS } from "@/content/company";
import { SLOT_CAPACITY } from "@/lib/business-rules";
import { getTaxiFees } from "@/lib/data/services";
import { formatCents } from "@/lib/format";
import { PLANS } from "@/lib/pricing-extras";
import { formatNumberBR } from "@/lib/motion/text";
import { STAGE_INFO, stagesFor } from "@/lib/tracking/stages";
import { cn } from "@/lib/utils";

/** Manhã ilustrativa de terça: cada faixa é um banhista; blocos = atendimentos (duração real do catálogo). */
const MORNING = [
  { lane: 0, start: 0, slots: 2, label: "Banho · P" },
  { lane: 0, start: 2, slots: 4, label: "Tosa completa · P" },
  { lane: 1, start: 0, slots: 3, label: "Banho · G" },
  { lane: 1, start: 4, slots: 2, label: "Hidratação · M" },
] as const;
const HOURS = ["9h", "10h", "11h"];

const tile = "relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl p-6";
const tileLink =
  "mt-auto flex w-fit items-center gap-1 rounded text-sm font-extrabold underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/60";

function joinNames(names: string[]): string {
  return names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} e ${names.at(-1)}`;
}

/** Diferenciais em grade "bento": blocos de tamanhos diferentes, cada um com um dado concreto do estúdio. */
export async function WhyBento() {
  const taxiFees = await getTaxiFees();
  const rating = STATS.find((stat) => stat.id === "rating");
  const biweekly = PLANS[0];

  return (
    <section aria-labelledby="por-que-titulo" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 flex max-w-2xl flex-col gap-2">
        <h2 id="por-que-titulo" className="text-3xl font-black tracking-tight sm:text-4xl">
          Pequeno de propósito, organizado de verdade
        </h2>
        <p className="text-muted-foreground">
          Seis motivos para trocar o pet shop lotado por hora marcada na Vila Madalena.
        </p>
      </div>

      <ul className="grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Capacidade (destaque) */}
        <Reveal as="li" className="sm:col-span-2 lg:row-span-2">
          <article className={cn(tile, "bg-primary")}>
            <p className="text-sm font-extrabold tracking-wide uppercase">Agenda sem fila</p>
            <h3 className="text-3xl leading-tight font-black sm:text-4xl">
              No máximo {SLOT_CAPACITY} pets por horário. Nunca 3.
            </h3>
            <p className="max-w-md">
              Cada atendimento ocupa todos os horários da sua duração, e o agendamento online não deixa passar disso.
              Ninguém espera em gaiola.
            </p>
            {/* Ilustração da agenda: duas faixas, uma por banhista. */}
            <figure className="mt-auto rounded-2xl bg-card/90 p-4 text-foreground shadow-sm">
              <div aria-hidden="true" className="flex flex-col gap-2">
                <div className="grid grid-cols-6 text-[11px] font-bold text-muted-foreground">
                  {HOURS.map((hour) => (
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
          </article>
        </Reveal>

        {/* 2. Avaliação */}
        {rating && (
          <Reveal as="li" delay={0.06}>
            <article className={cn(tile, "bg-foreground text-background")}>
              <Star className="size-6 fill-primary text-primary" aria-hidden="true" />
              <h3 className="font-[family-name:var(--font-fraunces)] text-5xl font-black text-primary">
                {formatNumberBR(rating.value, rating.decimals)}
              </h3>
              <p className="text-sm text-background/80">{rating.label}</p>
            </article>
          </Reveal>
        )}

        {/* 3. Táxi dog */}
        <Reveal as="li" delay={0.12}>
          <article className={cn(tile, "bg-secondary/25")}>
            <Car className="size-6 text-secondary-strong" aria-hidden="true" />
            <h3 className="text-xl font-black">Táxi dog na capital toda</h3>
            <ul className="flex flex-col gap-1 text-sm">
              {taxiFees.map((fee) => (
                <li key={fee.feeCents} className="flex justify-between gap-2">
                  <span>{joinNames(fee.zones)}</span>
                  <strong>{formatCents(fee.feeCents)}</strong>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>

        {/* 4. Acompanhe o banho */}
        <Reveal as="li" delay={0.06} className="sm:col-span-2">
          <article className={cn(tile, "border-2 border-dashed border-primary/50 bg-card")}>
            <Radio className="size-6 text-primary-strong" aria-hidden="true" />
            <h3 className="text-xl font-black">Acompanhe o banho de onde estiver</h3>
            <ol className="flex flex-wrap gap-2 text-xs font-extrabold" aria-label="Etapas do atendimento">
              {stagesFor("tosa-completa").map((stage, index) => (
                <li key={stage} className={cn("rounded-full px-3 py-1", index < 2 ? "bg-secondary" : "bg-muted")}>
                  {STAGE_INFO[stage].label}
                </li>
              ))}
            </ol>
            <Link href="/minha-conta#acompanhe" className={cn(tileLink, "text-primary-strong")}>
              Ver na área do tutor <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </article>
        </Reveal>

        {/* 5. Produtos */}
        <Reveal as="li" delay={0.12} className="sm:col-span-1 lg:col-span-2">
          <article className={cn(tile, "texture-paper bg-accent")}>
            <Leaf className="size-6 text-primary-strong" aria-hidden="true" />
            <h3 className="text-xl font-black">pH neutro, sem parabenos, sem corantes</h3>
            <p className="text-sm text-muted-foreground">
              Shampoo hipoalergênico com registro no Ministério da Agricultura e secagem em ar morno.
            </p>
            <Link href="/seguranca" className={cn(tileLink, "text-primary-strong")}>
              Ver o protocolo completo <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </article>
        </Reveal>

        {/* 6. Plano */}
        <Reveal as="li" delay={0.18} className="lg:col-span-2">
          <article className={cn(tile, "bg-card shadow-sm")}>
            <Wallet className="size-6 text-secondary-strong" aria-hidden="true" />
            <h3 className="text-xl font-black">
              {biweekly.name}: {biweekly.discountPercent}% a menos
            </h3>
            <p className="text-sm text-muted-foreground">
              {biweekly.bathsPerMonth} banhos por mês com horário fixo. Sem fidelidade.
            </p>
            <Link href="/precos" className={cn(tileLink, "text-primary-strong")}>
              Ver planos e preços <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </article>
        </Reveal>
      </ul>
    </section>
  );
}
