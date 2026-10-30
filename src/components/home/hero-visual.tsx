"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { ShieldCheck, Star } from "lucide-react";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

/** Deslocamento máximo (px) da camada mais "próxima". Leve de propósito. */
const MAX_SHIFT = 12;

/** Camada que se move na proporção da sua "profundidade" (depth). */
function Layer({
  x,
  y,
  depth,
  className,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  className?: string;
  children: ReactNode;
}) {
  const tx = useTransform(x, (value) => value * depth * MAX_SHIFT);
  const ty = useTransform(y, (value) => value * depth * MAX_SHIFT);
  return (
    <m.div className={cn("absolute", className)} style={{ x: tx, y: ty }}>
      {children}
    </m.div>
  );
}

const float = (delay: number) => ({ "--float-delay": `${delay}ms` }) as CSSProperties;

type HeroVisualProps = {
  /** Foto recortada (renderizada no servidor). */
  photo: ReactNode;
  /** Rabiscos decorativos (renderizados no servidor). */
  doodles: ReactNode;
  rating: string;
  reviews: string;
  className?: string;
};

/**
 * Composição do hero: pets recortados "apoiados" num grande círculo caramelo, rabiscos à mão e cartões
 * flutuantes. Parallax só com mouse (camadas em profundidades diferentes, com mola); parado no toque,
 * no teclado e com prefers-reduced-motion. Decorativo: as informações dos cartões também estão em texto na página.
 */
export function HeroVisual({ photo, doodles, rating, reviews, className }: HeroVisualProps) {
  const reducedMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 90, damping: 20, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 90, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reducedMotion) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reducedMotion, rawX, rawY]);

  return (
    <div className={cn("relative aspect-[1/1.02] w-full overflow-hidden", className)}>
      {/* Círculo grande (cortado na base, como um "palco") e círculo menta menor */}
      <Layer x={x} y={y} depth={-0.3} className="inset-x-[3%] -bottom-[24%] aspect-square">
        <div className="size-full rounded-full bg-primary" aria-hidden="true" />
      </Layer>
      <Layer x={x} y={y} depth={-0.7} className="top-[8%] right-[6%] size-[16%]">
        <div className="size-full rounded-full bg-secondary" aria-hidden="true" />
      </Layer>

      <Layer x={x} y={y} depth={-0.9} className="inset-0">
        {doodles}
      </Layer>

      {/* Foto apoiada na base */}
      <div className="absolute inset-x-[10%] bottom-0 top-[14%] [mask-image:linear-gradient(to_left,transparent,black_16%)]">
        {photo}
      </div>

      {/* Cartões flutuantes */}
      <Layer x={x} y={y} depth={1.2} className="top-[6%] left-0">
        <div
          className="float-y flex items-center gap-3 rounded-2xl bg-card px-3 py-2.5 shadow-xl shadow-foreground/10"
          style={float(0)}
          aria-hidden="true"
        >
          <span className="flex -space-x-2">
            {["#E8833A", "#5BBFA0", "#2B2B2B"].map((color, index) => (
              <span
                key={color}
                className="grid size-7 place-items-center rounded-full border-2 border-card text-[10px] font-black text-white"
                style={{ backgroundColor: color }}
              >
                {["M", "R", "J"][index]}
              </span>
            ))}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="flex items-center gap-1 text-sm font-black">
              <Star className="size-3.5 fill-primary text-primary" /> {rating}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">{reviews}</span>
          </span>
        </div>
      </Layer>
      <Layer x={x} y={y} depth={1.5} className="right-0 top-[44%]">
        <div
          className="float-y flex items-center gap-2 rounded-full bg-card py-2 pr-4 pl-2 text-xs font-extrabold shadow-xl shadow-foreground/10 sm:text-sm"
          style={float(900)}
          aria-hidden="true"
        >
          <span className="grid size-7 place-items-center rounded-full bg-secondary">
            <ShieldCheck className="size-4" />
          </span>
          Banhistas certificados
        </div>
      </Layer>
      <Layer x={x} y={y} depth={1} className="bottom-[8%] left-[2%]">
        <div
          className="float-y flex items-center gap-2 rounded-full bg-foreground py-2 pr-4 pl-3 text-xs font-extrabold text-background shadow-xl sm:text-sm"
          style={float(1800)}
          aria-hidden="true"
        >
          <span className="relative flex size-2.5">
            <span className="pulse-ring absolute inset-0 rounded-full bg-secondary" />
            <span className="relative size-2.5 rounded-full bg-secondary" />
          </span>
          Ao vivo: Paçoca na secagem
        </div>
      </Layer>
    </div>
  );
}
