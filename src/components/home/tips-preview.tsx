import Link from "next/link";
import { ArrowRight, ArrowUpRight, Brain, HeartPulse, Home, Repeat } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ARTICLES, type Article } from "@/content/articles";
import { formatNumericDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const CATEGORY_STYLE: Record<Article["category"], { icon: typeof Brain; tone: string }> = {
  Rotina: { icon: Repeat, tone: "bg-primary" },
  Comportamento: { icon: Brain, tone: "bg-secondary" },
  Saúde: { icon: HeartPulse, tone: "bg-accent" },
  "Cuidados em casa": { icon: Home, tone: "bg-secondary/40" },
};

/** Três dicas mais recentes do blog, com capa colorida por categoria. */
export function TipsPreview() {
  const latest = [...ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3);

  return (
    <section aria-labelledby="dicas-home-titulo" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 id="dicas-home-titulo" className="text-3xl font-black sm:text-4xl">
            Dicas de <span className="text-primary-display">cuidado</span>
          </h2>
          <p className="max-w-lg text-muted-foreground">O que a gente explica todo dia na recepção, por escrito.</p>
        </div>
        <Button asChild variant="outline" className="w-fit">
          <Link href="/dicas">
            Ver todas as dicas <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
      <ul className="grid gap-6 md:grid-cols-3">
        {latest.map((article) => {
          const style = CATEGORY_STYLE[article.category];
          return (
            <li key={article.slug}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-transform duration-300 focus-within:ring-[3px] focus-within:ring-ring/60 hover:-translate-y-1">
                <div className={cn("relative grid h-40 place-items-center", style.tone)} aria-hidden="true">
                  <span className="grid size-20 place-items-center rounded-full bg-white/50 transition-transform duration-300 group-hover:scale-110">
                    <style.icon className="size-10" strokeWidth={1.75} />
                  </span>
                  <span className="absolute top-4 left-4 rounded-full bg-card px-3 py-1 text-xs font-extrabold">
                    {article.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <p className="text-xs text-muted-foreground">
                    <time dateTime={article.publishedAt}>{formatNumericDate(article.publishedAt)}</time> ·{" "}
                    {article.readingMinutes} min de leitura
                  </p>
                  <h3 className="text-lg leading-snug font-black">
                    <Link
                      href={`/dicas/${article.slug}`}
                      className="outline-none after:absolute after:inset-0 after:rounded-3xl"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="flex-1 text-sm text-muted-foreground">{article.summary}</p>
                  <span className="flex items-center gap-1 text-sm font-extrabold text-primary-strong" aria-hidden="true">
                    Ler dica <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
