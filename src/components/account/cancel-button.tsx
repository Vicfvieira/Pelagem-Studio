"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cancelAppointmentAction, type ActionResult } from "@/lib/account/actions";

/** Cancelamento em dois cliques: evita cancelar por engano. */
export function CancelButton({ appointmentId, label }: { appointmentId: string; label: string }) {
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const cancel = () =>
    startTransition(async () => {
      const response = await cancelAppointmentAction(appointmentId);
      setResult(response);
      setConfirming(false);
    });

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      {!confirming ? (
        <Button type="button" variant="outline" size="sm" onClick={() => setConfirming(true)} disabled={pending}>
          Cancelar<span className="sr-only"> {label}</span>
        </Button>
      ) : (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={`Confirmar cancelamento: ${label}`}>
          <span className="text-sm font-semibold">Cancelar mesmo?</span>
          <Button type="button" variant="destructive" size="sm" onClick={cancel} disabled={pending} autoFocus>
            {pending ? "Cancelando..." : "Sim, cancelar"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setConfirming(false)} disabled={pending}>
            Não
          </Button>
        </div>
      )}
      <p role="status" className={result?.ok === false ? "text-sm font-semibold text-destructive" : "sr-only"}>
        {result?.message}
      </p>
    </div>
  );
}
