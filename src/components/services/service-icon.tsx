import { Bath, Droplets, PawPrint, Scissors, Sparkles, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  banho: Bath,
  "banho-tosa-higienica": Sparkles,
  "tosa-completa": Scissors,
  hidratacao: Droplets,
  "corte-de-unhas": PawPrint,
};

/** Ícone decorativo do serviço, em um quadrado menta. */
export function ServiceIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? Bath;
  return (
    <span
      className={cn("grid size-12 place-items-center rounded-2xl bg-secondary/30", className)}
      aria-hidden="true"
    >
      <Icon className="size-6 text-secondary-strong" />
    </span>
  );
}
