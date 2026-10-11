import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, CircleCheck, MapPin } from "lucide-react";

import { HeroIllustration } from "@/components/home/hero-illustration";
import { HeroVisual } from "@/components/home/hero-visual";
import { Photo } from "@/components/media/photo";
import { MagneticButton, SplitText } from "@/components/motion";
import { Button } from "@/components/ui/button";

const TRUST = ["Ter. a sáb., 9h às 18h", "Até 2 pets por horário", "Cancelamento grátis até 24h antes"];

/** Atraso (ms) para cada bloco entrar depois do título. */
const rise = (delay: number) => ({ "--rise-delay": `${delay}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="relative overflow-hidden">
      {/* Textura de pontos e forma orgânica ao fundo (decorativas). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(#ead9c6_1.2px,transparent_1.2px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-48 size-[34rem] rounded-full bg-[radial-gradient(closest-side,#fde6d2,transparent)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pt-10 pb-14 md:grid-cols-[1.05fr_1fr] md:pt-16 md:pb-20">
        <div className="flex flex-col gap-6">
          <p className="rise-in flex w-fit items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-bold text-primary-strong shadow-sm">
            <MapPin className="size-4" aria-hidden="true" />
            Pet spa na Vila Madalena · São Paulo
          </p>

          <h1
            id="hero-titulo"
            className="text-[2.6rem] leading-[1.02] font-black tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            <SplitText text="Banho e tosa" className="block" delay={60} />
            <SplitText text="sem pressa." className="block text-primary-display" delay={300} />
          </h1>

          <p className="slide-in max-w-prose text-lg text-muted-foreground sm:text-xl" style={rise(450)}>
            Hora marcada, <strong className="text-foreground">dois banhistas por horário</strong> e{" "}
            <strong className="text-foreground">produtos hipoalergênicos</strong>. Você agenda online em 5 passos e, se
            preferir, o <strong className="text-foreground">táxi dog</strong> busca e leva seu pet em toda a capital.
          </p>

          <div className="rise-in flex flex-col gap-3 sm:flex-row sm:items-center" style={rise(600)}>
            <MagneticButton className="w-full sm:w-auto">
              <Button asChild size="lg" className="h-14 w-full px-8 text-lg shadow-lg shadow-primary/25 sm:w-auto">
                <Link href="/agendar">
                  Agendar um horário <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </MagneticButton>
            <Button asChild size="lg" variant="outline" className="h-14 w-full px-8 text-lg sm:w-auto">
              <Link href="/servicos">Ver serviços e preços</Link>
            </Button>
          </div>

          <ul
            className="rise-in flex flex-col gap-2 text-sm font-semibold text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5"
            style={rise(750)}
          >
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CircleCheck className="size-4 text-secondary-strong" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rise-in mx-auto w-full max-w-[34rem]" style={rise(200)}>
          <HeroVisual
            photo={
              <Photo
                slot="hero"
                priority
                sizes="(min-width: 768px) 440px, 80vw"
                fallback={<HeroIllustration className="absolute inset-x-0 bottom-0 w-full" />}
              />
            }
          />
        </div>
      </div>
    </section>
  );
}
