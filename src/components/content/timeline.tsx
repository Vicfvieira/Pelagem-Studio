"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { MapPin } from "lucide-react";
import { AnimatePresence, m } from "motion/react";

import type { TimelineEvent } from "@/content/company";
import { cn } from "@/lib/utils";

/**
 * Linha do tempo interativa no padrão de abas (WAI-ARIA Tabs): cada ano é uma aba.
 * Teclado: setas esquerda/direita (e cima/baixo), Home e End; só a aba ativa entra no Tab.
 */
export function Timeline({ events }: { events: readonly TimelineEvent[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();
  const event = events[active];

  function select(index: number) {
    const next = (index + events.length) % events.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const actions: Record<string, () => void> = {
      ArrowRight: () => select(active + 1),
      ArrowDown: () => select(active + 1),
      ArrowLeft: () => select(active - 1),
      ArrowUp: () => select(active - 1),
      Home: () => select(0),
      End: () => select(events.length - 1),
    };
    const action = actions[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        {/* Trilho e progresso */}
        <div className="absolute top-5 right-5 left-5 h-1 rounded-full bg-border" aria-hidden="true" />
        <m.div
          className="absolute top-5 left-5 h-1 origin-left rounded-full bg-primary"
          style={{ right: "1.25rem" }}
          initial={false}
          animate={{ scaleX: events.length > 1 ? active / (events.length - 1) : 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          aria-hidden="true"
        />
        <div role="tablist" aria-label="Linha do tempo do Pelagem Studio" className="relative flex justify-between">
          {events.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.year}
                ref={(element) => {
                  tabs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`${baseId}-aba-${index}`}
                aria-selected={selected}
                aria-controls={`${baseId}-painel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={onKeyDown}
                className="group flex min-w-11 flex-col items-center gap-2 rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
              >
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-full border-4 transition-transform duration-300",
                    index <= active ? "border-primary bg-primary" : "border-border bg-card",
                    selected ? "scale-110" : "group-hover:scale-105",
                  )}
                  aria-hidden="true"
                >
                  <span className={cn("size-2.5 rounded-full", index <= active ? "bg-foreground" : "bg-border")} />
                </span>
                <span className={cn("text-sm font-extrabold sm:text-base", !selected && "text-muted-foreground")}>
                  {item.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-painel`}
        aria-labelledby={`${baseId}-aba-${active}`}
        tabIndex={0}
        className="min-h-56 rounded-2xl border bg-card p-6 shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 sm:min-h-44 sm:p-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={event.year}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3"
          >
            <p className="flex items-center gap-2 text-sm font-bold text-secondary-strong">
              <MapPin className="size-4" aria-hidden="true" />
              {event.year} · {event.place}
            </p>
            <h3 className="text-2xl font-black tracking-tight">{event.title}</h3>
            <p className="max-w-prose text-muted-foreground">{event.text}</p>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
