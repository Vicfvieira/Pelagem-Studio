import Link from "next/link";
import { Check } from "lucide-react";

import { HeroIllustration } from "@/components/home/hero-illustration";
import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  "Agendamento online em 5 passos",
  "Táxi dog em toda a capital",
  "Produtos hipoalergênicos",
];

export function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div className="flex flex-col gap-6">
          <p className="w-fit rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-primary-strong">
            Pet spa na Vila Madalena · São Paulo
          </p>
          <h1 id="hero-titulo" className="text-4xl leading-tight font-black tracking-tight sm:text-5xl">
            Banho e tosa com carinho, do jeitinho que seu pet merece.
          </h1>
          <p className="max-w-prose text-lg text-muted-foreground">
            Hora marcada, sem gaiolas e sem pressa. Dois banhistas dedicados cuidam de cada pet
            enquanto você acompanha tudo pelo site.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/agendar">Agendar um horário</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/servicos">Ver serviços e preços</Link>
            </Button>
          </div>
          <ul className="flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:flex-wrap sm:gap-x-6">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-secondary-strong" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HeroIllustration className="mx-auto w-full max-w-md" />
      </div>
    </section>
  );
}
