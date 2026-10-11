"use client";

import { useEffect, useState } from "react";
import { CalendarX, Loader2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { addDaysToDate, MAX_DAYS_AHEAD, nextOpenDays, type PetSizeCode } from "@/lib/business-rules";
import { formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AvailabilityResponse } from "@/lib/validation/availability";
import type { BookingInput } from "@/lib/validation/booking";

type Loaded = { key: string; data: AvailabilityResponse } | { key: string; error: string };

type StepDateTimeProps = {
  today: string;
  firstDay: string;
  servico: string;
  size: PetSizeCode;
  /** Incrementado quando o servidor recusa o horário, para buscar a agenda de novo. */
  refreshToken: number;
};

export function StepDateTime({ today, firstDay, servico, size, refreshToken }: StepDateTimeProps) {
  const {
    register,
    control,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext<BookingInput>();
  const date = useWatch({ control, name: "data" });
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  // A chave identifica a consulta; "carregando" = ainda não chegou resposta para a chave atual.
  const key = date ? `${new URLSearchParams({ data: date, servico, porte: size })}#${refreshToken}` : null;
  const loading = key !== null && loaded?.key !== key;

  useEffect(() => {
    if (!key || !date) return;
    const controller = new AbortController();
    const query = new URLSearchParams({ data: date, servico, porte: size });

    fetch(`/api/disponibilidade?${query}`, { signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json()) as AvailabilityResponse & { erro?: string };
        if (!response.ok) throw new Error(body.erro ?? "Não foi possível carregar os horários.");
        // Se o horário escolhido sumiu (lotou ou mudou o dia), limpa a escolha.
        if (!body.horarios.some((slot) => slot.hora === getValues("hora"))) setValue("hora", "");
        setLoaded({ key, data: body });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoaded({ key, error: error instanceof Error ? error.message : "Erro ao carregar os horários." });
      });

    return () => controller.abort();
  }, [key, date, servico, size, getValues, setValue]);

  const quickDays = nextOpenDays(firstDay, 6);
  const current = loaded?.key === key ? loaded : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold" id="dias-rapidos">
          Próximos dias com atendimento
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="dias-rapidos">
          {quickDays.map((day) => (
            <button
              key={day}
              type="button"
              aria-pressed={date === day}
              onClick={() => {
                setValue("data", day);
                setValue("hora", "");
                clearErrors("data");
              }}
              className={cn(
                "min-h-11 rounded-2xl border-2 px-3 text-sm font-bold capitalize outline-none",
                "hover:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/60",
                date === day ? "border-primary bg-accent" : "bg-card",
              )}
            >
              {formatShortDate(day)}
            </button>
          ))}
        </div>
      </div>

      <FormField label="Ou escolha outra data" error={errors.data?.message} hint="Terça a sábado, com até 30 dias de antecedência.">
        <Input
          type="date"
          min={today}
          max={addDaysToDate(today, MAX_DAYS_AHEAD)}
          className="sm:max-w-xs"
          {...register("data", { onChange: () => setValue("hora", "") })}
        />
      </FormField>

      <fieldset aria-busy={loading} className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-bold">Horários disponíveis</legend>

        {!date && <p className="text-muted-foreground">Escolha uma data para ver os horários.</p>}

        {loading && (
          <p className="flex items-center gap-2 text-muted-foreground" role="status">
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Buscando horários livres...
          </p>
        )}

        {current && "error" in current && (
          <p role="alert" className="font-semibold text-destructive">
            {current.error}
          </p>
        )}

        {current && "data" in current && current.data.horarios.length === 0 && (
          <p className="flex items-center gap-2 rounded-2xl bg-muted p-4" role="status">
            <CalendarX className="size-5 shrink-0" aria-hidden="true" />
            {current.data.mensagem ?? "Nenhum horário livre nesta data."}
          </p>
        )}

        {current && "data" in current && current.data.horarios.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {current.data.horarios.map((slot) => (
              <label
                key={slot.inicio}
                className={cn(
                  "relative flex cursor-pointer flex-col items-center rounded-2xl border-2 bg-card px-2 py-2.5",
                  "hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-accent",
                  "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/60",
                )}
              >
                <input type="radio" value={slot.hora} className="sr-only" {...register("hora")} />
                <span className="text-base font-black">{slot.hora}</span>
                <span className="text-xs text-muted-foreground">
                  {slot.vagas === 1 ? "última vaga" : `${slot.vagas} vagas`}
                </span>
              </label>
            ))}
          </div>
        )}

        {errors.hora?.message && <p className="text-sm font-semibold text-destructive">{errors.hora.message}</p>}
      </fieldset>
    </div>
  );
}
