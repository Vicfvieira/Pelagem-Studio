"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * - LazyMotion + domAnimation: carrega só as features usadas (bundle menor que o `motion` completo).
 *   `strict` impede usar o componente `motion.*` pesado por engano; use `m.*`.
 * - reducedMotion="user": respeita prefers-reduced-motion em TODA animação do site.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
