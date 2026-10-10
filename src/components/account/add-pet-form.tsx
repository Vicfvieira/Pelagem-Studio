"use client";

import { useId, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { FormAlert } from "@/components/auth/form-alert";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPetAction } from "@/lib/account/actions";
import { PET_SIZE_LABELS, sizeFromWeight } from "@/lib/business-rules";
import { petSchema, type PetInput } from "@/lib/validation/account";

export function AddPetForm({ startOpen = false }: { startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const panelId = useId();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PetInput>({
    resolver: zodResolver(petSchema),
    defaultValues: { name: "", species: "CACHORRO", breed: "", birthDate: "", notes: "" },
  });

  // Mostra o porte calculado só como prévia: o servidor recalcula a partir do peso.
  const weight = useWatch({ control, name: "weightKg" });
  const previewSize = typeof weight === "number" && weight > 0 ? sizeFromWeight(weight) : null;

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await createPetAction(values);
    if (!result.ok) return setServerError(result.message);
    setSuccess(result.message);
    reset();
    setOpen(false);
  });

  return (
    <div className="flex flex-col gap-4">
      <p role="status" className={success ? "font-semibold text-secondary-strong" : "sr-only"}>
        {success}
      </p>
      {!open ? (
        <Button
          type="button"
          variant="secondary"
          className="w-fit"
          aria-expanded={false}
          aria-controls={panelId}
          onClick={() => {
            setSuccess(null);
            setOpen(true);
          }}
        >
          <Plus aria-hidden="true" /> Cadastrar pet
        </Button>
      ) : (
        <form id={panelId} onSubmit={onSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border bg-card p-5">
          <h3 className="text-lg font-extrabold">Novo pet</h3>
          <FormAlert message={serverError} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nome" error={errors.name?.message}>
              <Input autoComplete="off" {...register("name")} />
            </FormField>
            <fieldset className="flex flex-col gap-1.5">
              <legend className="mb-1.5 text-sm font-bold">Espécie</legend>
              <div className="flex gap-2">
                {(["CACHORRO", "GATO"] as const).map((species) => (
                  <label
                    key={species}
                    className="relative flex h-12 flex-1 cursor-pointer items-center justify-center rounded-2xl border-2 bg-card font-bold has-[:checked]:border-primary has-[:checked]:bg-accent has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/60"
                  >
                    <input type="radio" value={species} className="sr-only" {...register("species")} />
                    {species === "CACHORRO" ? "Cachorro" : "Gato"}
                  </label>
                ))}
              </div>
            </fieldset>
            <FormField label="Raça" error={errors.breed?.message} hint="Use SRD para sem raça definida.">
              <Input autoComplete="off" {...register("breed")} />
            </FormField>
            <FormField
              label="Peso (kg)"
              error={errors.weightKg?.message}
              hint={previewSize ? `Porte ${previewSize}: ${PET_SIZE_LABELS[previewSize].range}` : "Define o porte e o preço."}
            >
              <Input type="number" inputMode="decimal" step="0.1" min="0.5" max="100" {...register("weightKg", { valueAsNumber: true })} />
            </FormField>
            <FormField label="Nascimento (opcional)" error={errors.birthDate?.message}>
              <Input type="date" {...register("birthDate")} />
            </FormField>
            <FormField label="Observações (opcional)" error={errors.notes?.message}>
              <Input placeholder="Ex.: pele sensível" {...register("notes")} />
            </FormField>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar pet"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
