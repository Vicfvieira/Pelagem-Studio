import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type OptionCardProps = Omit<ComponentProps<"input">, "type"> & {
  children: ReactNode;
  className?: string;
};

/** Rádio nativo com aparência de card: teclado (setas) e leitor de tela funcionam de graça. */
export function OptionCard({ children, className, ...input }: OptionCardProps) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 bg-card p-4",
        "hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-accent",
        "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/60",
        "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
        className,
      )}
    >
      <input type="radio" className="sr-only" {...input} />
      {children}
    </label>
  );
}
