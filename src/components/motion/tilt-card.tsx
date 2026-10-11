"use client";

import type { PointerEvent, ReactNode } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  /** Inclinação máxima em graus. Sutil de propósito. */
  max?: number;
  className?: string;
};

/**
 * Cartão que inclina levemente em 3D seguindo o cursor. Só mouse (no toque não há "hover"),
 * só transform, e desligado com prefers-reduced-motion. Volta ao lugar com mola ao sair.
 */
export function TiltCard({ children, max = 5, className }: TiltCardProps) {
  const reducedMotion = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * max * 2);
    rotateX.set(-y * max * 2);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <m.div
      className={cn("h-full [transform-style:preserve-3d]", className)}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </m.div>
  );
}
