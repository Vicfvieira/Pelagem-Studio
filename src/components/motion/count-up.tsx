"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

import { easeOutExpo, formatNumberBR } from "@/lib/motion/text";
import { cn } from "@/lib/utils";

type CountUpProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Duração em ms. */
  duration?: number;
  className?: string;
};

/**
 * Número que conta de 0 até `value` quando aparece na tela.
 * - Atualiza o texto direto no DOM a cada frame (sem re-render do React).
 * - A largura final fica reservada desde o início (grid sobreposto), então nada "pula" (CLS 0).
 * - Leitores de tela e buscadores leem só o valor final (sr-only); a contagem é aria-hidden.
 */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1800, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reducedMotion = useReducedMotion();
  const format = (n: number) => `${prefix}${formatNumberBR(n, decimals)}${suffix}`;
  const finalText = format(value);

  useEffect(() => {
    const element = ref.current;
    if (!element || !inView) return;
    if (reducedMotion) {
      element.textContent = finalText;
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      element.textContent = `${prefix}${formatNumberBR(value * easeOutExpo(progress), decimals)}${suffix}`;
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reducedMotion, value, decimals, prefix, suffix, duration, finalText]);

  return (
    <span className={cn("inline-grid tabular-nums", className)}>
      <span className="sr-only">{finalText}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {finalText}
      </span>
      <span ref={ref} aria-hidden="true" className="col-start-1 row-start-1">
        {format(0)}
      </span>
    </span>
  );
}
