import { Quote } from "lucide-react";

import { RatingStars } from "@/components/content/rating-stars";
import type { Testimonial } from "@/content/testimonials";

/** Cartão de depoimento (componente de servidor: o carrossel só cuida da rolagem). */
export function TestimonialCard({ item, position, total }: { item: Testimonial; position: number; total: number }) {
  return (
    <figure
      aria-roledescription="depoimento"
      aria-label={`${position} de ${total}: ${item.tutor}`}
      className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <RatingStars rating={item.rating} />
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
  );
}
