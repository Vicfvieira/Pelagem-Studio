import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CountUp, MagneticButton, Marquee, Reveal, SplitText } from "@/components/motion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Base de movimento",
  robots: { index: false, follow: false },
};

const NEIGHBORHOODS = ["Vila Madalena", "Pinheiros", "Perdizes", "Vila Mariana", "Moema", "Itaim Bibi", "Butantã", "Lapa"];

/** Vitrine temporária dos componentes de movimento (Etapa A1). Removida na Etapa A6. */
export default function MotionShowcasePage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-20 px-4 py-14">
      <section className="flex flex-col gap-4">
        <p className="text-sm font-bold text-primary-strong uppercase">SplitText · letras ao carregar</p>
        <SplitText as="h1" text="Banho tranquilo, pelo macio." className="text-4xl leading-tight font-black tracking-tight md:text-6xl" />
        <SplitText
          as="p"
          by="word"
          delay={600}
          text="Cada palavra entra em sequência, sem esperar o JavaScript carregar."
          className="max-w-prose text-lg text-muted-foreground"
        />
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-sm font-bold text-primary-strong uppercase">MagneticButton · passe o mouse</p>
        <div className="flex flex-wrap gap-4">
          <MagneticButton>
            <Button asChild size="lg">
              <Link href="/agendar">
                Agendar um horário <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </MagneticButton>
          <MagneticButton strength={0.4}>
            <Button asChild size="lg" variant="outline">
              <Link href="/servicos">Ver preços</Link>
            </Button>
          </MagneticButton>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-sm font-bold text-primary-strong uppercase">Marquee · faixa infinita (pausa no hover, foco ou botão)</p>
        <Marquee label="Bairros atendidos pelo táxi dog" duration={30}>
          {NEIGHBORHOODS.map((name) => (
            <span key={name} className="mx-3 rounded-full bg-secondary/25 px-5 py-2 text-lg font-bold whitespace-nowrap">
              {name}
            </span>
          ))}
        </Marquee>
      </section>

      <div className="h-[40vh]" aria-hidden="true" />

      <section className="flex flex-col gap-6">
        <SplitText
          as="h2"
          by="word"
          trigger="inView"
          text="Números que contam quando aparecem"
          className="text-3xl font-black tracking-tight"
        />
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "pets atendidos", value: 12480, suffix: "+" },
            { label: "avaliação média", value: 4.9, decimals: 1, suffix: "/5" },
            { label: "anos de experiência", value: 7 },
            { label: "banhistas", value: 2 },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border bg-card p-5">
              <dd className="text-4xl font-black">
                <CountUp value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </dd>
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {(["up", "left", "right"] as const).map((direction, index) => (
          <Reveal key={direction} direction={direction} delay={index * 0.1} className="rounded-2xl border bg-card p-6">
            <p className="font-extrabold">Reveal · {direction}</p>
            <p className="text-sm text-muted-foreground">Entra uma única vez quando 20% fica visível.</p>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
