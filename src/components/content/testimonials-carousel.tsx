"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

import type { Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/utils";

/**
 * Carrossel sem rolagem automática (o tutor controla o ritmo): faixa com scroll-snap, que também
 * funciona com o dedo, e botões anterior/próximo. Cada cartão é um "slide" com posição anunciada.
 * Com prefers-reduced-motion, a rolagem dos botões é instantânea.
 */
export function TestimonialsCarousel({ items }: { items: readonly Testimonial[] }) {
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
    <div role="region" aria-roledescription="carrossel" aria-label="Depoimentos de tutores" className="flex flex-col gap-6">
      <ul
        ref={track}
        className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <li
            key={item.tutor}
            className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <figure
              aria-roledescription="depoimento"
              aria-label={`${index + 1} de ${items.length}: ${item.tutor}`}
              className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <p className="flex gap-0.5" role="img" aria-label={`Avaliação: ${item.rating} de 5 estrelas`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn("size-5", i < item.rating ? "fill-primary text-primary" : "text-border")}
                      aria-hidden="true"
                    />
                  ))}
                </p>
                <Quote className="size-8 text-secondary/60" aria-hidden="true" />
              </div>
              <blockquote className="flex-1 text-base leading-relaxed">“{item.quote}”</blockquote>
              <figcaption className="flex flex-col gap-1 border-t pt-4 text-sm">
                <span className="font-extrabold">
                  {item.tutor} <span className="font-semibold text-muted-foreground">· {item.neighborhood}</span>
                </span>
                <span className="text-muted-foreground">
                  {item.pet}, {item.breed}
                </span>
                <span className="w-fit rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-primary-strong">
                  {item.service}
                </span>
              </figcaption>
            </figure>
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
