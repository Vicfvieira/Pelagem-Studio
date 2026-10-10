"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";

import type { FaqCategory } from "@/content/faq";
import { cn } from "@/lib/utils";

/**
 * Perguntas por categoria em abas (WAI-ARIA Tabs, setas/Home/End) e respostas em <details>,
 * que já é acessível e abre/fecha com Enter ou espaço sem JavaScript.
 * Os painéis inativos ficam `hidden`, mas continuam no HTML (e no JSON-LD da página) para buscadores.
 */
export function FaqTabs({ categories }: { categories: readonly FaqCategory[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  function select(index: number) {
    const next = (index + categories.length) % categories.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: categories.length - 1,
    };
    if (event.key in keys) {
      event.preventDefault();
      select(keys[event.key]);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Categorias de perguntas"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:flex-wrap sm:justify-center"
      >
        {categories.map((category, index) => {
          const selected = index === active;
          return (
            <button
              key={category.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-aba-${category.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-painel-${category.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={onKeyDown}
              className={cn(
                "min-h-11 shrink-0 rounded-full px-5 text-sm font-extrabold whitespace-nowrap outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/60",
                selected ? "bg-foreground text-background" : "border bg-card hover:bg-accent",
              )}
            >
              {category.label}
              <span className={cn("ml-2 text-xs", selected ? "text-background/75" : "text-muted-foreground")}>
                {category.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {categories.map((category, index) => (
        <div
          key={category.id}
          role="tabpanel"
          id={`${baseId}-painel-${category.id}`}
          aria-labelledby={`${baseId}-aba-${category.id}`}
          hidden={index !== active}
          className="mx-auto flex w-full max-w-3xl flex-col gap-3"
        >
          {category.items.map((item) => (
            <details key={item.question} className="group rounded-2xl border bg-card shadow-sm open:shadow-md">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 font-bold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  className="size-5 shrink-0 text-primary-strong transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-5 pb-5 text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}
