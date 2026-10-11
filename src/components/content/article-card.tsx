import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

import type { Article } from "@/content/articles";
import { formatNumericDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Cartão de artigo: o link cobre o cartão todo, mas só o título é anunciado (sem texto duplicado). */
type ArticleCardProps = { article: Article; headingLevel?: "h2" | "h3"; featured?: boolean };

export function ArticleCard({ article, headingLevel = "h2", featured = false }: ArticleCardProps) {
  const Heading = headingLevel;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-3 rounded-2xl border p-6 shadow-sm",
        featured ? "bg-accent md:p-10" : "bg-card",
        "transition-transform duration-300 focus-within:ring-[3px] focus-within:ring-ring/60 hover:-translate-y-1",
      )}
    >
      <div className="flex items-center justify-between gap-2 text-xs font-bold">
        <span className="rounded-full bg-secondary/25 px-3 py-1 text-secondary-strong">{article.category}</span>
        <ArrowUpRight
          className="size-5 text-primary-strong transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </div>
      <Heading className={cn("leading-snug font-black", featured ? "text-2xl sm:text-4xl" : "text-xl")}>
        <Link href={`/dicas/${article.slug}`} className="outline-none after:absolute after:inset-0 after:rounded-2xl">
          {article.title}
        </Link>
      </Heading>
      <p className={cn("flex-1 text-muted-foreground", featured ? "text-base sm:text-lg" : "text-sm")}>{article.summary}</p>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <time dateTime={article.publishedAt}>{formatNumericDate(article.publishedAt)}</time>
        <span aria-hidden="true">·</span>
        <Clock className="size-3.5" aria-hidden="true" />
        {article.readingMinutes} min de leitura
      </p>
    </article>
  );
}
