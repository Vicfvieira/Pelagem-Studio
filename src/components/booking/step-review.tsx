"use client";

import { useFormContext } from "react-hook-form";

import { FormField } from "@/components/forms/form-field";
import type { WizardPet } from "@/components/booking/types";
import type { TaxiQuote } from "@/lib/booking/taxi";
import type { CatalogService } from "@/lib/data/services";
import { formatCents, formatDuration, formatLocalDate } from "@/lib/format";
import type { BookingInput } from "@/lib/validation/booking";

type StepReviewProps = {
  pet: WizardPet;
  service: CatalogService;
  quote: TaxiQuote | null;
};

export function StepReview({ pet, service, quote }: StepReviewProps) {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<BookingInput>();
  const { data, hora, taxi, numero, complemento } = getValues();
  const { priceCents, durationMinutes } = service.prices[pet.size];
  const taxiFee = taxi && quote?.ok ? quote.feeCents : 0;

  const rows: Array<[string, string]> = [
    ["Pet", `${pet.name} (porte ${pet.size})`],
    ["Serviço", `${service.name} · ${formatDuration(durationMinutes)}`],
    ["Quando", `${formatLocalDate(data)}, às ${hora}`],
    [
      "Táxi dog",
      taxi && quote?.ok
        ? `${quote.street}, ${numero}${complemento ? ` - ${complemento}` : ""} - ${quote.neighborhood}`
        : "Não, vou levar até o studio",
    ],
  ];

  return (
    <div className="flex flex-col gap-6">
      <dl className="divide-y rounded-2xl border bg-card">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:gap-4">
            <dt className="text-sm font-bold text-muted-foreground sm:w-28 sm:shrink-0">{label}</dt>
            <dd className="first-letter:uppercase">{value}</dd>
          </div>
        ))}
      </dl>

      <dl className="flex flex-col gap-2 rounded-2xl bg-muted p-4">
        <div className="flex justify-between">
          <dt>{service.name}</dt>
          <dd>{formatCents(priceCents)}</dd>
        </div>
        {taxiFee > 0 && (
          <div className="flex justify-between">
            <dt>Táxi dog</dt>
            <dd>{formatCents(taxiFee)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t pt-2 text-lg font-black">
          <dt>Total</dt>
          <dd>{formatCents(priceCents + taxiFee)}</dd>
        </div>
        <p className="text-xs text-muted-foreground">Pagamento no studio. O valor é confirmado pelo sistema ao agendar.</p>
      </dl>

      <FormField label="Observações (opcional)" error={errors.observacoes?.message} hint="Ex.: tem medo do secador, pele sensível.">
        <textarea
          rows={3}
          maxLength={500}
          className="w-full rounded-2xl border-2 border-input bg-card px-4 py-3 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
          {...register("observacoes")}
        />
      </FormField>
    </div>
  );
}
