import Link from "next/link";
import { PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { BookingSummary } from "@/lib/booking/book";
import { toSaoPauloDate, toSaoPauloTime } from "@/lib/business-rules";
import { formatCents, formatLocalDate } from "@/lib/format";

/** Confirmação com os valores DEVOLVIDOS PELO SERVIDOR (não os exibidos no formulário). */
export function BookingSuccess({ booking, onNew }: { booking: BookingSummary; onNew: () => void }) {
  const start = new Date(booking.startAt);

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border bg-card p-6 text-center sm:p-10">
      <span className="grid size-16 place-items-center rounded-2xl bg-secondary" aria-hidden="true">
        <PartyPopper className="size-8" />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black" tabIndex={-1} id="agendamento-confirmado">
          Agendamento confirmado!
        </h2>
        <p className="text-muted-foreground">
          {booking.serviceName} para <strong className="text-foreground">{booking.petName}</strong>,{" "}
          <span className="first-letter:uppercase">{formatLocalDate(toSaoPauloDate(start))}</span>, às{" "}
          {toSaoPauloTime(start)}.
        </p>
        {booking.taxiAddress && <p className="text-sm text-muted-foreground">Táxi dog: {booking.taxiAddress}</p>}
        <p className="text-lg font-black">Total: {formatCents(booking.totalCents)}</p>
      </div>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button asChild>
          <Link href="/minha-conta">Ver meus agendamentos</Link>
        </Button>
        <Button type="button" variant="outline" onClick={onNew}>
          Agendar outro
        </Button>
      </div>
    </div>
  );
}
