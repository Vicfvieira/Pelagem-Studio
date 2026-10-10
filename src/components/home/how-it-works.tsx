import { CalendarCheck, Car, Scissors } from "lucide-react";

const STEPS = [
  {
    icon: Scissors,
    title: "Escolha o serviço",
    text: "Veja preço e duração para o porte do seu pet: P, M ou G. Sem surpresas no caixa.",
  },
  {
    icon: CalendarCheck,
    title: "Marque o horário",
    text: "Escolha um horário livre de terça a sábado, das 9h às 18h, com até 30 dias de antecedência.",
  },
  {
    icon: Car,
    title: "Traga ou use o táxi dog",
    text: "Buscamos e levamos seu pet em toda a capital. Você acompanha tudo em Minha conta.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="como-funciona-titulo" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 id="como-funciona-titulo" className="mb-10 text-center text-3xl font-black tracking-tight">
          Como funciona
        </h2>
        <ol className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col items-center gap-3 text-center">
              <span className="relative grid size-16 place-items-center rounded-2xl bg-primary" aria-hidden="true">
                <step.icon className="size-7" />
                <span className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-foreground text-sm font-black text-background">
                  {index + 1}
                </span>
              </span>
              <h3 className="text-lg font-extrabold">
                <span className="sr-only">Passo {index + 1}: </span>
                {step.title}
              </h3>
              <p className="max-w-xs text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
