"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { Car, Check, Leaf, ShieldCheck } from "lucide-react";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { HeroIllustration } from "@/components/home/hero-illustration";
import { cn } from "@/lib/utils";

/** Deslocamento máximo (px) da camada mais "próxima". Leve de propósito. */
const MAX_SHIFT = 14;

/** Passos do "Acompanhe o banho" (prévia; a funcionalidade real chega na área do tutor). */
const STEPS = ["Recebido", "Banho", "Secagem", "Tosa", "Pronto"] as const;
const CURRENT_STEP = 2;

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

function Badge({
  icon: Icon,
  children,
  tone,
  floatDelay,
}: {
  icon: typeof ShieldCheck;
  children: ReactNode;
  tone: "primary" | "secondary";
  floatDelay: number;
}) {
  return (
    <div
      className="float-y flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 text-xs font-extrabold shadow-lg shadow-primary/10 sm:text-sm"
      style={{ "--float-delay": `${floatDelay}ms` } as CSSProperties}
    >
      <span
        className={cn(
          "grid size-7 shrink-0 place-items-center rounded-full sm:size-8",
          tone === "primary" ? "bg-primary" : "bg-secondary",
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      {children}
    </div>
  );
}

/**
 * Composição do hero: pet recortado numa forma orgânica, selos flutuando e um cartão de status.
 * Parallax: o cursor (só mouse) desloca cada camada conforme a profundidade, com mola.
 * Em telas de toque, no teclado e com prefers-reduced-motion, tudo fica parado.
 * Visual decorativo: as mesmas informações aparecem em texto no hero e nas páginas.
 */
export function HeroVisual({ className }: { className?: string }) {
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
      // -1 a 1 a partir do centro da janela.
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reducedMotion, rawX, rawY]);

  return (
    <div className={cn("relative aspect-square w-full", className)} aria-hidden="true">
      {/* Formas de fundo */}
      <Layer x={x} y={y} depth={-0.4} className="inset-[4%]">
        <div className="size-full rounded-[58%_42%_47%_53%/45%_55%_45%_55%] bg-secondary/25" />
      </Layer>
      <Layer x={x} y={y} depth={-0.8} className="right-[2%] bottom-[6%] size-[26%]">
        <div className="size-full rounded-full bg-primary/20" />
      </Layer>

      {/* "Foto" recortada: ilustração própria até a foto definitiva (A5). */}
      <Layer x={x} y={y} depth={0.35} className="inset-[10%]">
        <div className="relative size-full overflow-hidden rounded-[46%_54%_42%_58%/52%_44%_56%_48%] bg-gradient-to-br from-accent to-[#ffd9b8] shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 [background-image:radial-gradient(#e8833a_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          <HeroIllustration className="absolute inset-x-0 bottom-0 w-full" />
        </div>
      </Layer>

      {/* Selos */}
      <Layer x={x} y={y} depth={1.2} className="top-[6%] left-0">
        <Badge icon={ShieldCheck} tone="secondary" floatDelay={0}>
          Banhistas certificados
        </Badge>
      </Layer>
      <Layer x={x} y={y} depth={1.6} className="top-[30%] right-0">
        <Badge icon={Leaf} tone="secondary" floatDelay={900}>
          Produtos hipoalergênicos
        </Badge>
      </Layer>
      <Layer x={x} y={y} depth={0.9} className="top-[58%] left-0 hidden sm:block">
        <Badge icon={Car} tone="primary" floatDelay={1800}>
          Táxi dog a partir de R$ 15
        </Badge>
      </Layer>

      {/* Cartão de status */}
      <Layer x={x} y={y} depth={1.4} className="right-[4%] bottom-0 w-[min(68%,250px)]">
        <div className="rounded-2xl border bg-card p-3 shadow-xl shadow-primary/10 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-extrabold">Paçoca · Shih-tzu</p>
            <span className="flex items-center gap-1.5 rounded-full bg-secondary/20 px-2 py-0.5 text-[11px] font-extrabold text-secondary-strong">
              <span className="relative flex size-2">
                <span className="pulse-ring absolute inset-0 rounded-full bg-secondary" />
                <span className="relative size-2 rounded-full bg-secondary-strong" />
              </span>
              Ao vivo
            </span>
          </div>
          <ol className="mt-3 flex items-center gap-1">
            {STEPS.map((step, index) => (
              <li key={step} className="flex flex-1 flex-col items-center gap-1">
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full text-[10px] font-black",
                    index < CURRENT_STEP && "bg-secondary text-foreground",
                    index === CURRENT_STEP && "bg-primary text-foreground ring-4 ring-primary/25",
                    index > CURRENT_STEP && "bg-muted text-muted-foreground",
                  )}
                >
                  {index < CURRENT_STEP ? <Check className="size-3" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "text-[10px] leading-none font-bold",
                    index === CURRENT_STEP ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-muted-foreground">
            Pronto para buscar por volta das <strong className="text-foreground">15h30</strong>
          </p>
        </div>
      </Layer>
    </div>
  );
}
