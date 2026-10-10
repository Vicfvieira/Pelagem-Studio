"use client";

import { useTransition } from "react";
import { Car, CheckCircle2, Loader2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { quoteTaxiAction } from "@/lib/booking/actions";
import type { TaxiQuote } from "@/lib/booking/taxi";
import { formatCents, formatCep } from "@/lib/format";
import type { BookingInput } from "@/lib/validation/booking";

type StepTaxiProps = {
  quote: TaxiQuote | null;
  onQuote: (quote: TaxiQuote | null) => void;
};

export function StepTaxi({ quote, onQuote }: StepTaxiProps) {
  const {
    register,
    control,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext<BookingInput>();
  const wantsTaxi = useWatch({ control, name: "taxi" });
  const [pending, startTransition] = useTransition();

  const calculate = () => {
    clearErrors("cep");
    startTransition(async () => onQuote(await quoteTaxiAction(getValues("cep") ?? "")));
  };

  return (
    <div className="flex flex-col gap-6">
      <label className="flex cursor-pointer items-start gap-4 rounded-2xl border-2 bg-card p-4 has-[:checked]:border-primary has-[:checked]:bg-accent has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/60">
        <input type="checkbox" className="mt-1 size-5 accent-[var(--primary-strong)]" {...register("taxi")} />
        <span className="flex flex-col gap-1">
          <span className="flex items-center gap-2 font-extrabold">
            <Car className="size-5" aria-hidden="true" /> Quero o táxi dog
          </span>
          <span className="text-sm text-muted-foreground">
            Buscamos e levamos seu pet na cidade de São Paulo. A taxa depende da zona do CEP.
          </span>
        </span>
      </label>

      {!wantsTaxi && <p className="text-muted-foreground">Sem problema! Você traz seu pet até o studio.</p>}

      {wantsTaxi && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="sm:w-56">
              <FormField label="CEP para busca" error={errors.cep?.message}>
                <Input
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  maxLength={9}
                  {...register("cep", { onChange: () => onQuote(null) })}
                />
              </FormField>
            </div>
            <Button type="button" variant="secondary" onClick={calculate} disabled={pending} className={errors.cep ? "sm:mb-7" : undefined}>
              {pending && <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
              {pending ? "Consultando..." : "Calcular taxa"}
            </Button>
          </div>

          <div role="status" aria-live="polite">
            {quote?.ok === false && <p className="font-semibold text-destructive">{quote.message}</p>}
            {quote?.ok && (
              <p className="flex items-start gap-3 rounded-2xl bg-secondary/20 p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-secondary-strong" aria-hidden="true" />
                <span>
                  <strong>
                    {quote.street || "Endereço"}, {quote.neighborhood}
                  </strong>{" "}
                  · CEP {formatCep(quote.cep)}
                  <br />
                  Zona {quote.zoneName}: taxa de <strong>{formatCents(quote.feeCents)}</strong> (ida e volta)
                </span>
              </p>
            )}
          </div>

          {quote?.ok && (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Número" error={errors.numero?.message}>
                <Input autoComplete="address-line2" {...register("numero")} />
              </FormField>
              <FormField label="Complemento (opcional)" error={errors.complemento?.message}>
                <Input placeholder="Apto, bloco..." {...register("complemento")} />
              </FormField>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
