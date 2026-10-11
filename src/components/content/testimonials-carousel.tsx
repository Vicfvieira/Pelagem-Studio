"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Carrossel sem rolagem automática (o tutor controla o ritmo): faixa com scroll-snap, que também
 * funciona com o dedo, e botões anterior/próximo. Cada cartão é um "slide" com posição anunciada.
 * Com prefers-reduced-motion, a rolagem dos botões é instantânea.
 * Os cartões chegam prontos do servidor (`slides`), então o cliente não precisa renderizá-los.
 */
export function TestimonialsCarousel({ slides }: { slides: ReadonlyArray<{ key: string; node: ReactNode }> }) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () =>
      setEdges({
        start: element.scrollLeft <= 4,
        end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
      });
    update();
    element.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      element.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scroll(direction: 1 | -1) {
    const element = track.current;
    const card = element?.querySelector("li");
    if (!element || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({ left: direction * (card.clientWidth + 24), behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Depoimentos de tutores"
      className="flex flex-col gap-6"
    >
      <ul
        ref={track}
        className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide) => (
          <li key={slide.key} className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
            {slide.node}
          </li>
        ))}
      </ul>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          disabled={edges.start}
          aria-label="Depoimento anterior"
          className="grid size-12 place-items-center rounded-full border-2 border-primary bg-card outline-none transition-transform hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:scale-100 disabled:opacity-40"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          disabled={edges.end}
          aria-label="Próximo depoimento"
          className="grid size-12 place-items-center rounded-full bg-primary outline-none transition-transform hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:scale-100 disabled:opacity-40"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
