"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useForm, useWatch, type Path } from "react-hook-form";

import { FormAlert } from "@/components/auth/form-alert";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JOB_ROLES, JOB_SHIFTS } from "@/content/careers";
import { submitJobApplication } from "@/lib/careers/actions";
import { cn } from "@/lib/utils";
import { jobApplicationSchema, type JobApplicationInput } from "@/lib/validation/careers";

const ABOUT_MAX = 1000;
const fieldClass =
  "w-full rounded-2xl border-2 border-input bg-card px-4 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 aria-invalid:border-destructive";

export function ApplicationForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const successRef = useRef<HTMLHeadingElement>(null);
  const form = useForm<JobApplicationInput>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: { name: "", email: "", phone: "", about: "", website: "" },
  });
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = form;
  const about = useWatch({ control, name: "about" }) ?? "";

  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  // A Server Action valida tudo de novo; os erros dela voltam para os campos.
  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await submitJobApplication(values);
    if (result.ok) {
      setSent(true);
      return;
    }
    setServerError(result.error);
    for (const [field, messages] of Object.entries(result.fields ?? {})) {
      if (messages?.[0]) setError(field as Path<JobApplicationInput>, { message: messages[0] });
    }
  });

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-3 rounded-2xl border-2 border-secondary bg-secondary/15 p-6 md:p-8">
        <CheckCircle2 className="size-10 text-secondary-strong" aria-hidden="true" />
        <h3 ref={successRef} tabIndex={-1} className="text-2xl font-black outline-none">
          Candidatura enviada!
        </h3>
        <p className="text-muted-foreground">
          Obrigado pelo interesse. A Helena lê todas as candidaturas e responde em até 10 dias úteis, por e-mail ou
          WhatsApp, quando o perfil combina com uma vaga.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormAlert message={serverError} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nome completo" error={errors.name?.message}>
          <Input autoComplete="name" {...register("name")} />
        </FormField>
        <FormField label="E-mail" error={errors.email?.message}>
          <Input type="email" autoComplete="email" inputMode="email" {...register("email")} />
        </FormField>
        <FormField label="Celular com DDD" error={errors.phone?.message}>
          <Input type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 91234-5678" {...register("phone")} />
        </FormField>
        <FormField label="Anos de experiência com pets" error={errors.experienceYears?.message} hint="0 se estiver começando agora.">
          <Input type="number" inputMode="numeric" min={0} max={50} step={1} {...register("experienceYears", { valueAsNumber: true })} />
        </FormField>
      </div>

      <fieldset className="flex flex-col gap-2" aria-describedby={errors.role ? "vaga-erro" : undefined}>
        <legend className="mb-1.5 text-sm font-bold">Vaga de interesse</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {JOB_ROLES.map((role) => (
            <label
              key={role.id}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-card p-4 has-[:checked]:border-primary has-[:checked]:bg-accent has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/60"
            >
              <input type="radio" value={role.id} className="mt-1 size-4 accent-[#a3501a]" {...register("role")} />
              <span className="flex flex-col">
                <span className="font-extrabold">{role.label}</span>
                <span className="text-xs text-muted-foreground">{role.open ? "Vaga aberta" : "Banco de talentos"}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.role && (
          <p id="vaga-erro" className="text-sm font-semibold text-destructive">
            {errors.role.message}
          </p>
        )}
      </fieldset>

      <FormField label="Disponibilidade" error={errors.shift?.message}>
        <select defaultValue="" className={cn(fieldClass, "h-12")} {...register("shift")}>
          <option value="" disabled>
            Escolha uma opção
          </option>
          {JOB_SHIFTS.map((shift) => (
            <option key={shift.id} value={shift.id}>
              {shift.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Conte sobre você"
        error={errors.about?.message}
        hint={`Onde trabalhou, que pets já atendeu e por que quer vir para cá. ${about.length}/${ABOUT_MAX} caracteres.`}
      >
        <textarea rows={5} maxLength={ABOUT_MAX} className={cn(fieldClass, "py-3")} {...register("about")} />
      </FormField>

      {/* Campo-isca: fora da tela e fora do Tab; leitores de tela também o ignoram. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-[#a3501a]"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consentimento-erro" : undefined}
            {...register("consent")}
          />
          <span>
            Autorizo o Pelagem Studio a usar meus dados só para este processo seletivo. Eles são apagados em até 6
            meses se não houver contratação.
          </span>
        </label>
        {errors.consent && (
          <p id="consentimento-erro" className="text-sm font-semibold text-destructive">
            {errors.consent.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="sm:w-fit">
        {isSubmitting ? "Enviando..." : "Enviar candidatura"}
      </Button>
    </form>
  );
}
