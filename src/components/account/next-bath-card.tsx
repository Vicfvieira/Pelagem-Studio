import Link from "next/link";
import { Bath, CalendarCheck } from "lucide-react";

import { StatusBadge } from "@/components/account/status-badge";
import { Button } from "@/components/ui/button";
import type { AccountPet } from "@/lib/data/account";
import { formatLocalDate } from "@/lib/format";

export function NextBathCard({ pet }: { pet: AccountPet }) {
  const suggestion = pet.nextBath;
  const bookHref = `/agendar?${new URLSearchParams({ servico: "banho", porte: pet.size })}`;

  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-extrabold">
          <Bath className="size-5 text-secondary-strong" aria-hidden="true" />
          {pet.name}
        </h3>
        {suggestion.status === "ATRASADO" && <StatusBadge tone="warning">Passou da hora</StatusBadge>}
        {suggestion.status === "JA_AGENDADO" && <StatusBadge tone="success">Agendado</StatusBadge>}
      </div>

      {suggestion.status === "SEM_HISTORICO" && (
        <p className="text-sm text-muted-foreground">Ainda sem banhos concluídos por aqui. Que tal o primeiro?</p>
      )}
      {suggestion.status === "JA_AGENDADO" && (
        <p className="flex items-center gap-2 text-sm">
          <CalendarCheck className="size-4 shrink-0" aria-hidden="true" />
          Próximo banho em <strong>{formatLocalDate(suggestion.scheduledDate)}</strong>
        </p>
      )}
      {(suggestion.status === "EM_DIA" || suggestion.status === "ATRASADO") && (
        <p className="text-sm">
          Sugerimos o próximo banho em{" "}
          <strong>{formatLocalDate(suggestion.suggestedDate)}</strong>
          <span className="block text-muted-foreground">
            15 dias após o último, em {formatLocalDate(suggestion.lastBathDate)}.
          </span>
        </p>
      )}

      {suggestion.status !== "JA_AGENDADO" && (
        <Button asChild size="sm" className="mt-auto w-fit">
          <Link href={bookHref}>
            Agendar banho<span className="sr-only"> para {pet.name}</span>
          </Link>
        </Button>
      )}
    </article>
  );
}
