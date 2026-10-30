import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, CalendarClock, Car, Leaf, PawPrint } from "lucide-react";

import { Doodle } from "@/components/home/doodles";
import { HeroIllustration } from "@/components/home/hero-illustration";
import { HeroVisual } from "@/components/home/hero-visual";
import { OrganicDivider } from "@/components/layout/organic-divider";
import { Photo } from "@/components/media/photo";
import { MagneticButton, SplitText } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { STATS } from "@/content/company";
import { formatNumberBR } from "@/lib/motion/text";

const TRUST = [
  { icon: CalendarClock, title: "Hora marcada", text: "Ter. a sáb., 9h às 18h" },
  { icon: Leaf, title: "Hipoalergênico", text: "pH neutro, sem parabenos" },
  { icon: Car, title: "Táxi dog", text: "Em toda a capital" },
] as const;

/** Atraso (ms) para cada bloco entrar depois do título. */
const rise = (delay: number) => ({ "--rise-delay": `${delay}ms` }) as CSSProperties;

const rating = STATS.find((stat) => stat.id === "rating");

export function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="relative overflow-hidden bg-accent/60">
      {/* Patinhas soltas ao fundo (decorativas). */}
      <Doodle kind="paw" className="absolute top-10 left-[46%] hidden size-10 -rotate-12 text-primary/15 md:block" />
      <Doodle kind="paw" className="absolute bottom-24 left-6 size-8 rotate-12 text-primary/15" />
      <Doodle kind="paw" className="absolute top-1/3 -left-2 hidden size-14 rotate-[30deg] text-secondary/20 lg:block" />

      <div className="relative mx-auto grid max-w-6xl items-end gap-4 px-4 pt-10 md:grid-cols-[1.05fr_1fr] md:gap-8 md:pt-14">
        <div className="flex flex-col gap-6 pb-4 md:self-center md:pb-16">
          <p className="rise-in flex w-fit items-center gap-2 text-sm font-black tracking-[0.18em] text-primary-strong uppercase">
            <PawPrint className="size-4" aria-hidden="true" />
            Pet spa · Vila Madalena
          </p>

          <h1
            id="hero-titulo"
            className="text-[2.75rem] leading-[1.02] font-black text-balance sm:text-6xl lg:text-[4.5rem]"
          >
            <SplitText text="Banho e tosa" className="block" delay={60} />
            <SplitText text="sem pressa." className="block text-primary-display" delay={300} />
          </h1>

          <p className="slide-in max-w-md text-lg text-muted-foreground" style={rise(450)}>
            Hora marcada, <strong className="text-foreground">dois banhistas por horário</strong> e produtos
            hipoalergênicos. Agende online em 5 passos e acompanhe o banho ao vivo pelo celular.
          </p>

          <div className="rise-in flex flex-col gap-3 sm:flex-row sm:items-center" style={rise(600)}>
            <MagneticButton className="w-full sm:w-auto">
              <Button asChild size="lg" className="h-14 w-full px-8 text-base shadow-lg shadow-primary/30 sm:w-auto">
                <Link href="/agendar">
                  Agendar um horário <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </MagneticButton>
            <Button asChild size="lg" variant="ghost" className="h-14 w-full px-6 text-base sm:w-auto">
              <Link href="/precos#simulador">Simular orçamento</Link>
            </Button>
          </div>

          <ul className="rise-in grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3" style={rise(750)}>
            {TRUST.map((item) => (
              <li key={item.title} className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-card shadow-sm" aria-hidden="true">
                  <item.icon className="size-5 text-primary-strong" />
                </span>
                <span className="flex flex-col leading-tight">
                  <strong className="text-sm font-extrabold">{item.title}</strong>
                  <span className="text-xs text-muted-foreground">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rise-in mx-auto w-full max-w-[34rem]" style={rise(150)}>
          <HeroVisual
            rating={rating ? formatNumberBR(rating.value, rating.decimals) : "4,9"}
            reviews="1.240 avaliações"
            doodles={
              <>
                <Doodle kind="heart" className="absolute top-[18%] left-[16%] size-9 -rotate-12 text-foreground" />
                <Doodle kind="squiggle" className="absolute top-[30%] right-[4%] w-14 text-primary-strong" />
                <Doodle kind="spark" className="absolute top-[4%] left-[52%] size-8 text-primary-strong" />
                <Doodle kind="paw" className="absolute top-[22%] right-[22%] size-8 rotate-12 text-secondary-strong" />
                <Doodle kind="dots" className="absolute bottom-[34%] left-[2%] w-10 text-secondary" />
              </>
            }
            photo={
              <Photo
                slot="hero"
                priority
                sizes="(min-width: 768px) 520px, 92vw"
                className="object-contain object-bottom"
                fallback={<HeroIllustration className="absolute inset-x-0 bottom-0 w-full" />}
              />
            }
          />
        </div>
      </div>
      <OrganicDivider className="-mt-px text-background" />
    </section>
  );
}
