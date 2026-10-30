import Link from "next/link";
import { Clock, MapPin, Radio } from "lucide-react";

const linkClass =
  "rounded-full underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-primary/70";

/** Faixa fina acima do header: localização, novidade e horário (como as lojas de pet que servem de referência). */
export function AnnouncementBar() {
  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto flex h-10 max-w-6xl items-center justify-center gap-6 px-4 text-xs font-semibold sm:text-sm md:justify-between">
        <div className="hidden items-center gap-5 md:flex">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-primary" aria-hidden="true" /> Vila Madalena · São Paulo
          </span>
          <Link href="/minha-conta#acompanhe" className={`flex items-center gap-1.5 ${linkClass}`}>
            <Radio className="size-3.5 text-secondary" aria-hidden="true" /> Acompanhe o banho
          </Link>
        </div>
        <p className="flex items-center gap-2">
          <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-black text-foreground">NOVO</span>
          <Link href="/precos#simulador" className={linkClass}>
            Simule seu orçamento em 30 segundos
          </Link>
        </p>
        <span className="hidden items-center gap-1.5 md:flex">
          <Clock className="size-3.5 text-primary" aria-hidden="true" /> Ter. a sáb., 9h às 18h
        </span>
      </div>
    </div>
  );
}
