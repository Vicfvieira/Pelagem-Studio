import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { ArticleCard } from "@/components/content/article-card";
import { JsonLd } from "@/components/content/json-ld";
import { TeamAvatar } from "@/components/content/team-avatar";
import { SplitText } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ARTICLES, getArticle } from "@/content/articles";
import { TEAM } from "@/content/company";
import { formatNumericDate } from "@/lib/format";
import { SITE } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/dicas/[slug]">): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/dicas/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.summary, publishedTime: article.publishedAt },
  };
}

export default async function ArticlePage({ params }: PageProps<"/dicas/[slug]">) {
  const article = getArticle((await params).slug);
  // Slugs fora da lista: 404 (com Cache Components não existe `dynamicParams = false`).
  if (!article) notFound();

  const author = TEAM.find((member) => member.name === article.author);
  const related = ARTICLES.filter((other) => other.slug !== article.slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, 3);

  return (
    <article className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 md:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.summary,
          datePublished: article.publishedAt,
          author: { "@type": "Person", name: article.author },
          publisher: { "@type": "Organization", name: SITE.name },
          mainEntityOfPage: `${siteUrl()}/dicas/${article.slug}`,
          inLanguage: "pt-BR",
        }}
      />

      <header className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <Link
          href="/dicas"
          className="flex w-fit items-center gap-2 rounded-2xl text-sm font-bold text-primary-strong outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/60"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Todas as dicas
        </Link>
        <p className="w-fit rounded-full bg-secondary/25 px-3 py-1 text-xs font-bold text-secondary-strong">
          {article.category}
        </p>
        <SplitText
          as="h1"
          text={article.title}
          by="word"
          stagger={60}
          className="text-4xl leading-[1.08] font-black tracking-tight text-balance sm:text-5xl"
        />
        <p className="text-xl text-muted-foreground">{article.summary}</p>
        <div className="flex items-center gap-3 border-y py-4 text-sm">
          {author && (
            <div className="size-11 shrink-0">
              <TeamAvatar name={author.name} tone={author.tone} />
            </div>
          )}
          <div>
            <p className="font-extrabold">
              {article.author}
              {author && <span className="font-semibold text-muted-foreground"> · {author.role}</span>}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <time dateTime={article.publishedAt}>{formatNumericDate(article.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <Clock className="size-3.5" aria-hidden="true" /> {article.readingMinutes} min de leitura
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 text-lg leading-relaxed">
        {article.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-4">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.list && (
              <ul className="flex flex-col gap-2 pl-1">
                {section.list.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <aside className="flex flex-col items-start gap-3 rounded-2xl bg-accent p-6 text-base">
          <p className="font-extrabold">Este conteúdo é informativo e não substitui a consulta com o veterinário.</p>
          <Button asChild>
            <Link href="/agendar">Agendar um banho</Link>
          </Button>
        </aside>
      </div>

      <section aria-labelledby="relacionados-titulo" className="flex flex-col gap-6 border-t pt-12">
        <h2 id="relacionados-titulo" className="text-2xl font-black tracking-tight">
          Continue lendo
        </h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {related.map((other) => (
            <li key={other.slug}>
              <ArticleCard article={other} headingLevel="h3" />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
