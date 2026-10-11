"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormAlert } from "@/components/auth/form-alert";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addVaccineAction } from "@/lib/account/actions";
import { vaccineSchema, type VaccineInput } from "@/lib/validation/account";

type VaccineFormFieldsProps = { petId: string; petName: string; onSaved: () => void; onCancel: () => void };

/** Formulário de vacina, carregado só quando aberto (ver add-vaccine-form.tsx). */
export default function VaccineFormFields({ petId, petName, onSaved, onCancel }: VaccineFormFieldsProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VaccineInput>({
    resolver: zodResolver(vaccineSchema),
    defaultValues: { petId, name: "", appliedAt: "", validUntil: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await addVaccineAction(values);
    if (!result.ok) return setServerError(result.message);
    onSaved();
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-3 rounded-2xl bg-muted p-4"
      aria-label={`Nova vacina de ${petName}`}
    >
      <FormAlert message={serverError} />
      <input type="hidden" {...register("petId")} />
      <FormField label="Vacina" error={errors.name?.message}>
        <Input placeholder="Ex.: V10, Antirrábica" {...register("name")} />
      </FormField>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Aplicada em" error={errors.appliedAt?.message}>
          <Input type="date" {...register("appliedAt")} />
        </FormField>
        <FormField label="Válida até" error={errors.validUntil?.message} hint="Normalmente 1 ano depois.">
          <Input type="date" {...register("validUntil")} />
        </FormField>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar vacina"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
