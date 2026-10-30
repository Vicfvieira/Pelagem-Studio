import Link from "next/link";
import { Cat, Dog, HeartHandshake, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

/** "Cuidado para cada pet": atalhos redondos por tipo de pet, como as categorias das lojas de referência. */
const CATEGORIES = [
  { label: "Cães até 10 kg", hint: "Porte P", href: "/servicos", icon: Dog, iconSize: "size-9", tone: "bg-accent" },
  { label: "Cães de 10 a 25 kg", hint: "Porte M", href: "/servicos", icon: Dog, iconSize: "size-11", tone: "bg-secondary/30" },
  { label: "Cães acima de 25 kg", hint: "Porte G", href: "/servicos", icon: Dog, iconSize: "size-14", tone: "bg-primary/25" },
  { label: "Gatos", hint: "Box fechado", href: "/perguntas-frequentes", icon: Cat, iconSize: "size-11", tone: "bg-muted" },
  { label: "Pelagem longa", hint: "Desembolo", href: "/precos#pelagem-titulo", icon: Sparkles, iconSize: "size-10", tone: "bg-secondary/30" },
  { label: "Idosos e ansiosos", hint: "Sem pressa", href: "/seguranca#cuidados-titulo", icon: HeartHandshake, iconSize: "size-10", tone: "bg-accent" },
] as const;

export function PetCategories() {
  return (
    <section aria-labelledby="categorias-titulo" className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <h2 id="categorias-titulo" className="text-3xl font-black sm:text-4xl">
          Cuidado para <span className="text-primary-display">cada pet</span>
        </h2>
        <p className="max-w-lg text-muted-foreground">
          Do shih-tzu de 4 kg ao golden de 35 kg, de gato a cachorro idoso: o atendimento se ajusta ao seu pet.
        </p>
      </div>
      <ul className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-6">
        {CATEGORIES.map((category) => (
          <li key={category.label}>
            <Link
              href={category.href}
              className="group flex flex-col items-center gap-3 rounded-2xl text-center outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
            >
              <span
                className={cn(
                  "grid aspect-square w-full max-w-28 place-items-center rounded-full border-4 border-card shadow-md transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:rotate-3",
                  category.tone,
                )}
                aria-hidden="true"
              >
                <category.icon className={cn(category.iconSize, "text-foreground")} strokeWidth={1.75} />
              </span>
              <span className="flex flex-col">
                <span className="text-sm leading-tight font-extrabold">{category.label}</span>
                <span className="text-xs text-muted-foreground">{category.hint}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
