"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";

/** Import dinâmico: as animações viram um arquivo separado, baixado depois do primeiro paint. */
const loadFeatures = () => import("@/components/motion/motion-features").then((mod) => mod.default);

/**
 * - LazyMotion com features assíncronas: os `m.*` renderizam na hora (com o estado inicial) e passam a
 *   animar quando o arquivo de animação chega, sem pesar no carregamento inicial (LCP/TBT).
 *   `strict` impede usar o componente `motion.*` pesado por engano; use `m.*`.
 * - reducedMotion="user": respeita prefers-reduced-motion em TODA animação do site.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
