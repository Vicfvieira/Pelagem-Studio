import type { Metadata } from "next";

import { ArticleCard } from "@/components/content/article-card";
import { PageHeader } from "@/components/content/page-header";
import { Reveal } from "@/components/motion";
import { ARTICLES } from "@/content/articles";

export const metadata: Metadata = {
  title: "Dicas de cuidado",
  description:
    "Frequência de banho, pets ansiosos, braquicefálicos, escovação, pulgas e unhas: dicas da equipe do Pelagem Studio.",
  alternates: { canonical: "/dicas" },
};

export default function TipsPage() {
  const [featured, ...rest] = [...ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 md:py-16">
      <PageHeader id="dicas-titulo" eyebrow="Escrito pela nossa equipe" title="Dicas para o dia a dia do seu pet">
        <p>O que a gente explica todo dia na recepção, com calma e por escrito. Nada aqui substitui o veterinário.</p>
      </PageHeader>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Primeiro cartão fica no topo: entrada por CSS (só transform), visível desde o primeiro paint. */}
        <li className="slide-in md:col-span-2 lg:row-span-2">
          <ArticleCard article={featured} featured />
        </li>
        {rest.map((article, index) => (
          <Reveal as="li" key={article.slug} delay={(index % 3) * 0.06}>
            <ArticleCard article={article} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
