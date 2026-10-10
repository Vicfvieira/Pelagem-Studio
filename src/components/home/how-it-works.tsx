import { CalendarCheck, Car, Scissors } from "lucide-react";

import { MAX_DAYS_AHEAD } from "@/lib/business-rules";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Scissors,
    title: "Escolha o serviço",
    text: "Cinco serviços com preço e duração por porte. O valor aparece antes de confirmar, sem surpresa no caixa.",
  },
  {
    icon: CalendarCheck,
    title: "Marque o horário",
    text: `Só aparecem horários com vaga, de terça a sábado, das 9h às 18h, com até ${MAX_DAYS_AHEAD} dias de antecedência.`,
  },
  {
    icon: Car,
    title: "Traga ou peça o táxi dog",
    text: "Buscamos em qualquer bairro da capital. No dia, você acompanha cada etapa do banho pela área do tutor.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-titulo"
      className="relative scroll-mt-20 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 id="como-funciona-titulo" className="mb-12 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
          Do agendamento ao pet cheiroso em 3 passos
        </h2>
        <div className="relative">
          {/* Caminho tracejado ligando os passos (só em telas largas, onde eles ficam em zigue-zague). */}
          <svg
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute inset-x-0 top-6 hidden h-40 w-full text-primary/50 md:block"
          >
            <path
              d="M120 40 C 300 40, 320 170, 500 160 S 720 30, 880 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="10 12"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* No celular, uma linha vertical faz o mesmo papel. */}
          <span
            className="absolute top-8 bottom-8 left-8 w-0.5 border-l-2 border-dashed border-primary/40 md:hidden"
            aria-hidden="true"
          />

          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className={cn(
                  "flex gap-5 md:flex-col md:items-start",
                  index === 1 && "md:mt-28",
                  index === 2 && "md:mt-6",
                )}
              >
                <span
                  className={cn(
                    "relative grid size-16 shrink-0 place-items-center rounded-[40%_60%_55%_45%/50%_45%_55%_50%] shadow-sm",
                    index === 1 ? "bg-secondary" : "bg-primary",
                  )}
                  aria-hidden="true"
                >
                  <step.icon className="size-7" />
                  <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-foreground text-sm font-black text-background">
                    {index + 1}
                  </span>
                </span>
                <div className="flex flex-col gap-2 rounded-2xl bg-card p-5 shadow-sm md:max-w-xs">
                  <h3 className="text-xl font-black">
                    <span className="sr-only">Passo {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
