import { Car, Leaf, MessageCircle, ShieldCheck, Star } from "lucide-react";

import { STATS } from "@/content/company";
import { formatNumberBR } from "@/lib/motion/text";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const rating = STATS.find((stat) => stat.id === "rating");

/** Faixa de garantias no fim da home (ícone + 2 linhas), como o rodapé de selos das lojas de referência. */
const ITEMS = [
  { icon: ShieldCheck, title: "Banhistas certificados", text: "Formação em comportamento", tone: "bg-secondary/30" },
  { icon: Leaf, title: "Produtos hipoalergênicos", text: "pH neutro, sem parabenos", tone: "bg-accent" },
  { icon: Car, title: "Táxi dog", text: "Toda a capital, ida e volta", tone: "bg-primary/25" },
  {
    icon: Star,
    title: rating ? `${formatNumberBR(rating.value, rating.decimals)} de avaliação` : "Bem avaliado",
    text: "1.240 avaliações",
    tone: "bg-secondary/30",
  },
  { icon: MessageCircle, title: "Fale no WhatsApp", text: SITE.phoneDisplay, tone: "bg-accent" },
] as const;

export function TrustFeatures() {
  return (
    <section aria-labelledby="garantias-titulo" className="mx-auto max-w-6xl px-4 pb-16">
      <h2 id="garantias-titulo" className="sr-only">
        Garantias do Pelagem Studio
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ITEMS.map((item) => (
          <li key={item.title} className={cn("flex items-center gap-3 rounded-2xl p-4", item.tone)}>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-card" aria-hidden="true">
              <item.icon className="size-5 text-primary-strong" />
            </span>
            <span className="flex flex-col leading-tight">
              <strong className="text-sm font-extrabold">{item.title}</strong>
              <span className="text-xs text-muted-foreground">{item.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
