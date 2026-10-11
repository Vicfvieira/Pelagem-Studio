"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 1 },
  down: { y: -1 },
  left: { x: 1 },
  right: { x: -1 },
  none: {},
};

type RevealProps = {
  children: ReactNode;
  as?: "div" | "section" | "article" | "li" | "span" | "figure";
  direction?: Direction;
  /** Deslocamento inicial em px. */
  distance?: number;
  /** Atraso em segundos. */
  delay?: number;
  /** Fração visível do elemento para disparar (0–1). */
  amount?: number;
  className?: string;
};

/**
 * Entrada suave ao rolar (uma vez). Só opacity + transform.
 * Com prefers-reduced-motion, o MotionConfig desliga o deslocamento e fica só o fade.
 */
export function Reveal({
  children,
  as = "div",
  direction = "up",
  distance = 28,
  delay = 0,
  amount = 0.2,
  className,
}: RevealProps) {
  const Component = m[as];
  const offset = OFFSET[direction];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, x: (offset.x ?? 0) * distance, y: (offset.y ?? 0) * distance }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </Component>
  );
}
