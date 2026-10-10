"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Erro inesperado em uma página: mantém header e rodapé e oferece tentar de novo. */
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    // Só o digest vai para o log do navegador; detalhes ficam nos logs do servidor.
    console.error("Erro na página", error.digest ?? error.name);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-20 text-center" aria-labelledby="erro-titulo">
      <span className="grid size-20 place-items-center rounded-2xl bg-destructive/10" aria-hidden="true">
        <TriangleAlert className="size-10 text-destructive" />
      </span>
      <h1 id="erro-titulo" className="text-3xl font-black tracking-tight md:text-4xl">
        Ops, algo deu errado
      </h1>
      <p className="text-lg text-muted-foreground">
        Tivemos um problema para carregar esta página. Tente de novo em instantes; se persistir, fale com a gente pelo WhatsApp.
      </p>
      {error.digest && <p className="text-sm text-muted-foreground">Código do erro: {error.digest}</p>}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" size="lg" onClick={() => retry()}>
          <RefreshCw aria-hidden="true" /> Tentar de novo
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    </section>
  );
}
