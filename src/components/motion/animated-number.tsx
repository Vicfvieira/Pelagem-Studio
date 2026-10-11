"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { easeOutExpo } from "@/lib/motion/text";

type AnimatedNumberProps = {
  value: number;
  format: (value: number) => string;
  /** Duração em ms. */
  duration?: number;
  className?: string;
};

/**
 * Número que "rola" do valor anterior até o novo (ex.: preço ao vivo do simulador).
 * Atualiza o texto direto no DOM (sem re-render por frame). O leitor de tela recebe só o valor final.
 */
export function AnimatedNumber({ value, format, duration = 500, className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const from = shown.current;
    if (reducedMotion || from === value) {
      shown.current = value;
      element.textContent = format(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      shown.current = from + (value - from) * easeOutExpo(progress);
      element.textContent = format(Math.round(shown.current));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, format, duration, reducedMotion]);

  return (
    <span className={className}>
      <span className="sr-only">{format(value)}</span>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {format(value)}
      </span>
    </span>
  );
}
