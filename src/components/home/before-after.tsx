"use client";

import { useId, useState, type CSSProperties } from "react";
import { MoveHorizontal } from "lucide-react";

import { GroomingIllustration } from "@/components/home/grooming-illustration";
import { Photo } from "@/components/media/photo";

/**
 * Comparador antes/depois. Um <input type="range"> transparente cobre a imagem: arrastar com mouse
 * ou dedo, ou usar as setas do teclado, move a divisória. O "antes" é recortado com clip-path e a
 * divisória anda com transform (sem recalcular layout).
 */
export function BeforeAfter({ caption }: { caption: string }) {
  const id = useId();
  const [position, setPosition] = useState(50);
  const style = { "--pos": `${position}%` } as CSSProperties;

  return (
    <figure className="flex flex-col gap-3">
      <div
        className="group relative aspect-[4/3] w-full touch-pan-y overflow-hidden rounded-2xl border bg-muted shadow-lg select-none"
        style={style}
      >
        <div className="absolute inset-0">
          <Photo
            slot="depois"
            sizes="(min-width: 768px) 600px, 100vw"
            fallback={<GroomingIllustration variant="depois" />}
          />
        </div>
        <div className="absolute inset-0 [clip-path:inset(0_calc(100%-var(--pos))_0_0)]">
          <Photo
            slot="antes"
            sizes="(min-width: 768px) 600px, 100vw"
            fallback={<GroomingIllustration variant="antes" />}
          />
        </div>

        <span
          className="absolute top-3 left-3 rounded-full bg-foreground/85 px-3 py-1 text-xs font-extrabold text-background"
          aria-hidden="true"
        >
          Antes
        </span>
        <span
          className="absolute top-3 right-3 rounded-full bg-secondary px-3 py-1 text-xs font-extrabold"
          aria-hidden="true"
        >
          Depois
        </span>

        {/* Divisória: o wrapper ocupa a largura toda e anda var(--pos) da própria largura. */}
        <div className="pointer-events-none absolute inset-0 [transform:translateX(var(--pos))]" aria-hidden="true">
          <div className="absolute inset-y-0 left-0 w-1 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" />
          <div className="absolute top-1/2 left-0 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-lg ring-primary/60 transition-transform duration-200 group-hover:scale-110 group-has-[:focus-visible]:ring-4">
            <MoveHorizontal className="size-5 text-primary-strong" />
          </div>
        </div>

        <label htmlFor={id} className="sr-only">
          Comparar antes e depois
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-valuetext={`${position}% da imagem mostra o antes`}
          className="absolute inset-0 size-full cursor-ew-resize appearance-none opacity-0"
        />
      </div>
      <figcaption className="text-sm text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}
