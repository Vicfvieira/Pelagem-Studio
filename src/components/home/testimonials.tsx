import { Star } from "lucide-react";

import { TestimonialsCarousel } from "@/components/content/testimonials-carousel";
import { STATS } from "@/content/company";
import { TESTIMONIALS } from "@/content/testimonials";
import { formatNumberBR } from "@/lib/motion/text";

const rating = STATS.find((stat) => stat.id === "rating");

export function Testimonials() {
  return (
    <section id="depoimentos" aria-labelledby="depoimentos-titulo" className="scroll-mt-20 overflow-hidden bg-muted/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-xl flex-col gap-2">
            <h2 id="depoimentos-titulo" className="text-3xl font-black tracking-tight sm:text-4xl">
              Quem já veio, volta
            </h2>
            <p className="text-muted-foreground">Histórias de tutores da zona oeste à zona sul, com nome do pet e tudo.</p>
          </div>
          {rating && (
            <p className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-bold shadow-sm">
              <Star className="size-5 fill-primary text-primary" aria-hidden="true" />
              {formatNumberBR(rating.value, rating.decimals)} {rating.label}
            </p>
          )}
        </div>
        <TestimonialsCarousel items={TESTIMONIALS} />
      </div>
    </section>
  );
}
