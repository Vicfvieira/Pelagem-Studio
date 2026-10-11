"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  /** Fração da distância do cursor ao centro que o elemento acompanha. */
  strength?: number;
  /** Deslocamento máximo em px. */
  max?: number;
  className?: string;
};

/**
 * Envolve um botão/link e faz ele seguir levemente o cursor (efeito "magnético").
 * Só com mouse: no toque e no teclado não há cursor para seguir. Desligado com prefers-reduced-motion.
 */
export function MagneticButton({ children, strength = 0.25, max = 10, className }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });
  const clamp = (value: number) => Math.max(-max, Math.min(max, value));

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(clamp((event.clientX - (rect.left + rect.width / 2)) * strength));
    y.set(clamp((event.clientY - (rect.top + rect.height / 2)) * strength));
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </m.div>
  );
}
