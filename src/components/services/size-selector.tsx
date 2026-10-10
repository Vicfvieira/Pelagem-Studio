"use client";

import { PET_SIZE_LABELS, PET_SIZES, type PetSizeCode } from "@/lib/business-rules";
import { cn } from "@/lib/utils";

type SizeSelectorProps = {
  value: PetSizeCode;
  onChange: (size: PetSizeCode) => void;
  className?: string;
};

/** Grupo de rádios nativos estilizados: setas do teclado, foco e leitor de tela funcionam sem JS extra. */
export function SizeSelector({ value, onChange, className }: SizeSelectorProps) {
  return (
    <fieldset className={cn("flex flex-col gap-3", className)}>
      <legend className="mb-3 text-sm font-extrabold">Qual é o porte do seu pet?</legend>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {PET_SIZES.map((size) => {
          const label = PET_SIZE_LABELS[size];
          return (
            <label
              key={size}
              className={cn(
                "relative flex cursor-pointer flex-col items-center gap-0.5 rounded-2xl border-2 bg-card px-2 py-3 text-center transition-colors",
                "hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-accent",
                "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/60",
              )}
            >
              <input
                type="radio"
                name="porte"
                value={size}
                checked={value === size}
                onChange={() => onChange(size)}
                className="sr-only"
              />
              <span className="text-2xl font-black">{size}</span>
              <span className="text-sm font-bold">{label.name}</span>
              <span className="text-xs text-muted-foreground">{label.range}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
