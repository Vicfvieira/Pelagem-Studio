import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Página não encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-20 text-center" aria-labelledby="nao-encontrada">
      <span className="grid size-20 place-items-center rounded-2xl bg-accent" aria-hidden="true">
        <SearchX className="size-10 text-primary-strong" />
      </span>
      <p className="text-sm font-bold tracking-wide text-primary-strong uppercase">Erro 404</p>
      <h1 id="nao-encontrada" className="text-3xl font-black tracking-tight md:text-4xl">
        Essa página fugiu do banho!
      </h1>
      <p className="text-lg text-muted-foreground">
        O endereço pode ter mudado ou não existir mais. Que tal voltar para o começo ou ver nossos serviços?
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">Voltar ao início</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/servicos">Ver serviços</Link>
        </Button>
      </div>
    </section>
  );
}
