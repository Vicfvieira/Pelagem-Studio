import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export const BOOKING_STEPS = ["Pet", "Serviço", "Data e horário", "Táxi dog", "Revisão"] as const;

/** Barra de progresso: lista ordenada com aria-current="step" + barra visual. */
export function BookingProgress({ current }: { current: number }) {
  const percent = (current / (BOOKING_STEPS.length - 1)) * 100;

  return (
    <nav aria-label="Etapas do agendamento" className="flex flex-col gap-3">
      <p className="text-sm font-bold text-muted-foreground">
        Passo {current + 1} de {BOOKING_STEPS.length}
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div
          className="h-full origin-left rounded-full bg-primary transition-transform duration-300 motion-reduce:transition-none"
          style={{ transform: `scaleX(${percent / 100})` }}
        />
      </div>
      <ol className="grid grid-cols-5 gap-1 text-center text-xs font-semibold">
        {BOOKING_STEPS.map((label, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={label} aria-current={active ? "step" : undefined} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full border-2 text-sm font-black",
                  done && "border-secondary bg-secondary",
                  active && "border-primary bg-primary",
                  !done && !active && "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" aria-hidden="true" /> : index + 1}
              </span>
              <span className={cn("hidden sm:block", !active && "text-muted-foreground")}>
                {label}
                {done && <span className="sr-only"> (concluído)</span>}
              </span>
              <span className="sr-only sm:hidden">{label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
