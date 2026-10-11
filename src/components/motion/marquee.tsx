"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  /** Rótulo acessível da faixa (ex.: "Bairros atendidos"). */
  label: string;
  /** Segundos para uma volta completa. */
  duration?: number;
  reverse?: boolean;
  className?: string;
};

/**
 * Faixa em rolagem infinita. O movimento é CSS (transform), sem JS por frame.
 * - Pausa no hover e no foco; o botão de pausa atende à WCAG 2.2.2 (movimento automático > 5 s).
 * - A cópia que fecha o loop é `inert`: links dela não entram duas vezes no Tab nem no leitor de tela.
 * - Com prefers-reduced-motion, não anima e a faixa vira rolável manualmente (CSS em globals.css).
 */
export function Marquee({ children, label, duration = 40, reverse = false, className }: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  const style = {
    "--marquee-duration": `${duration}s`,
    "--marquee-direction": reverse ? "reverse" : "normal",
  } as CSSProperties;

  return (
    <div className={cn("relative", className)}>
      <div
        role="region"
        aria-label={label}
        data-paused={paused}
        className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      >
        <div className="marquee-track" style={style}>
          <div className="flex shrink-0 items-center">{children}</div>
          <div className="flex shrink-0 items-center" aria-hidden="true" inert>
            {children}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        aria-label={paused ? `Retomar animação: ${label}` : `Pausar animação: ${label}`}
        className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-muted-foreground shadow-sm outline-none transition-transform hover:scale-110 focus-visible:ring-[3px] focus-visible:ring-ring/60 motion-reduce:hidden"
      >
        {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
      </button>
    </div>
  );
}
