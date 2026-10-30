import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Calculator, Car, Droplets, Radio, Wallet } from "lucide-react";

import { Doodle } from "@/components/home/doodles";
import { PET_SIZES } from "@/lib/business-rules";
import { getServicesCatalog, getTaxiFees } from "@/lib/data/services";
import { formatCents } from "@/lib/format";
import { PLANS } from "@/lib/pricing-extras";
import { STAGE_INFO, stagesFor } from "@/lib/tracking/stages";
import { cn } from "@/lib/utils";

type TileProps = {
  eyebrow: string;
  title: ReactNode;
  text: string;
  href: string;
  cta: string;
  icon: typeof Car;
  className: string;
  /** Botão escuro sobre fundo claro (padrão) ou claro sobre fundo escuro. */
  inverted?: boolean;
  children?: ReactNode;
};

function Tile({ eyebrow, title, text, href, cta, icon: Icon, className, inverted = false, children }: TileProps) {
  return (
    <article className={cn("relative flex h-full flex-col gap-3 overflow-hidden rounded-3xl p-6 sm:p-7", className)}>
      <span
        className={cn(
          "absolute -right-8 -bottom-8 grid size-32 place-items-center rounded-full",
          inverted ? "bg-white/10" : "bg-white/45",
        )}
        aria-hidden="true"
      >
        <Icon className="size-14 -translate-x-3 -translate-y-3" strokeWidth={1.5} />
      </span>
      <p className="text-xs font-black tracking-[0.18em] uppercase">{eyebrow}</p>
      <h3 className="relative text-3xl leading-[1.05] font-black sm:text-4xl">{title}</h3>
      <p className="relative max-w-[15rem] text-sm sm:max-w-[17rem]">{text}</p>
      {children}
      <Link
        href={href}
        className={cn(
          "relative mt-auto inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold shadow-sm outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/60",
          inverted ? "bg-background text-foreground" : "bg-foreground text-background",
        )}
      >
        {cta} <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

/** Blocos coloridos de destaque (táxi, planos, hidratação, simulador, acompanhamento) com dados reais do estúdio. */
export async function PromoTiles() {
  const [services, taxiFees] = await Promise.all([getServicesCatalog(), getTaxiFees()]);
  const taxiFrom = taxiFees.length ? Math.min(...taxiFees.map((fee) => fee.feeCents)) : null;
  const hydration = services.find((service) => service.slug === "hidratacao");
  const hydrationFrom = hydration ? Math.min(...PET_SIZES.map((size) => hydration.prices[size].priceCents)) : null;
  const maxDiscount = Math.max(...PLANS.map((plan) => plan.discountPercent));

  return (
    <section aria-labelledby="destaques-titulo" className="mx-auto max-w-6xl px-4 pb-16">
      <h2 id="destaques-titulo" className="sr-only">
        Destaques do Pelagem Studio
      </h2>
      <ul className="grid gap-5 md:grid-cols-6">
        {taxiFrom !== null && (
          <li className="md:col-span-2">
            <Tile
              eyebrow="Táxi dog"
              title={
                <>
                  <span className="block text-base font-extrabold">a partir de</span>
                  {formatCents(taxiFrom)}
                </>
              }
              text="Buscamos e levamos seu pet em qualquer bairro da capital, ida e volta."
              href="/servicos"
              cta="Ver taxas"
              icon={Car}
              className="bg-secondary/40"
            />
          </li>
        )}
        <li className="md:col-span-2">
          <Tile
            eyebrow="Planos mensais"
            title={
              <>
                até {maxDiscount}%<span className="block text-base font-extrabold">de desconto no banho</span>
              </>
            }
            text="2 ou 4 banhos por mês com horário fixo. Sem fidelidade."
            href="/precos#planos-titulo"
            cta="Ver planos"
            icon={Wallet}
            className="bg-primary"
          />
        </li>
        {hydrationFrom !== null && (
          <li className="md:col-span-2">
            <Tile
              eyebrow="Hidratação"
              title={
                <>
                  <span className="block text-base font-extrabold">a partir de</span>
                  {formatCents(hydrationFrom)}
                </>
              }
              text="Máscara de hidratação profunda para pelos ressecados, com escovação."
              href="/agendar?servico=hidratacao"
              cta="Agendar"
              icon={Droplets}
              className="bg-accent"
            />
          </li>
        )}
        <li className="md:col-span-3">
          <Tile
            eyebrow="Simulador"
            title="Seu orçamento em 30 segundos"
            text="Espécie, peso, pelagem e adicionais: o preço muda na hora e vira agendamento com um clique."
            href="/precos#simulador"
            cta="Simular agora"
            icon={Calculator}
            className="bg-primary-strong text-white"
            inverted
          >
            <Doodle kind="squiggle" className="absolute top-6 right-8 hidden w-16 text-white/60 sm:block" />
          </Tile>
        </li>
        <li className="md:col-span-3">
          <Tile
            eyebrow="Acompanhe o banho"
            title="Cada etapa, ao vivo"
            text="Do recebimento ao pronto para buscar, direto na área do tutor."
            href="/minha-conta#acompanhe"
            cta="Ver na área do tutor"
            icon={Radio}
            className="bg-foreground text-background"
            inverted
          >
            <ol className="relative flex flex-wrap gap-1.5 text-xs font-extrabold" aria-label="Etapas do atendimento">
              {stagesFor("tosa-completa").map((stage, index) => (
                <li
                  key={stage}
                  className={cn(
                    "rounded-full px-3 py-1",
                    index < 2 ? "bg-secondary text-foreground" : index === 2 ? "bg-primary text-foreground" : "bg-white/15",
                  )}
                >
                  {STAGE_INFO[stage].label}
                </li>
              ))}
            </ol>
          </Tile>
        </li>
      </ul>
    </section>
  );
}
