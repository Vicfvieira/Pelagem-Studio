import { Car } from "lucide-react";

import { CancelButton } from "@/components/account/cancel-button";
import { StatusBadge } from "@/components/account/status-badge";
import type { AccountAppointment } from "@/lib/data/account";
import { toSaoPauloDate, toSaoPauloTime } from "@/lib/business-rules";
import { formatCents, formatLocalDate } from "@/lib/format";

const STATUS: Record<AccountAppointment["status"], { label: string; tone: "success" | "neutral" | "danger" }> = {
  AGENDADO: { label: "Agendado", tone: "success" },
  CONCLUIDO: { label: "Concluído", tone: "neutral" },
  CANCELADO: { label: "Cancelado", tone: "danger" },
};

function when(iso: string): string {
  const start = new Date(iso);
  return `${formatLocalDate(toSaoPauloDate(start))}, ${toSaoPauloTime(start)}`;
}

export function AppointmentList({ items, mode }: { items: AccountAppointment[]; mode: "upcoming" | "history" }) {
  return (
    <ul className="divide-y rounded-2xl border bg-card">
      {items.map((item) => {
        const label = `${item.serviceName} de ${item.petName} em ${when(item.startAt)}`;
        return (
          <li key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="font-extrabold">
                {item.serviceName} · {item.petName}
              </p>
              <p className="text-sm first-letter:uppercase">{when(item.startAt)}</p>
              <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {formatCents(item.totalCents)}
                {item.taxi && (
                  <span className="inline-flex items-center gap-1">
                    <Car className="size-4" aria-hidden="true" /> com táxi dog
                  </span>
                )}
                {mode === "history" && <StatusBadge tone={STATUS[item.status].tone}>{STATUS[item.status].label}</StatusBadge>}
              </p>
            </div>
            {mode === "upcoming" &&
              (item.cancellable ? (
                <CancelButton appointmentId={item.id} label={label} />
              ) : (
                <p className="max-w-56 text-sm text-muted-foreground sm:text-right">
                  Faltam menos de 24h: para cancelar, fale com a gente pelo WhatsApp.
                </p>
              ))}
          </li>
        );
      })}
    </ul>
  );
}
