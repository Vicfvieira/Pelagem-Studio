"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FormAlert } from "@/components/auth/form-alert";
import { PasswordInput } from "@/components/auth/password-input";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/lib/auth/actions";
import { registerSchema } from "@/lib/validation/auth";

export function RegisterForm() {
  const callbackUrl = useSearchParams().get("callbackUrl") ?? undefined;
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  // O servidor valida e normaliza tudo de novo: a validação no cliente é só para a experiência.
  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await registerAction(values, callbackUrl);
    if (result?.error) setServerError(result.error);
  });

  const loginHref = callbackUrl ? `/entrar?${new URLSearchParams({ callbackUrl })}` : "/entrar";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormAlert message={serverError} />

      <FormField label="Nome completo" error={errors.name?.message}>
        <Input autoComplete="name" {...register("name")} />
      </FormField>

      <FormField label="E-mail" error={errors.email?.message}>
        <Input type="email" autoComplete="email" inputMode="email" {...register("email")} />
      </FormField>

      <FormField label="Celular (opcional)" error={errors.phone?.message} hint="Com DDD, para avisarmos quando o pet estiver pronto.">
        <Input type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 91234-5678" {...register("phone")} />
      </FormField>

      <FormField label="Senha" error={errors.password?.message} hint="Mínimo de 8 caracteres, com letras e números.">
        <PasswordInput autoComplete="new-password" {...register("password")} />
      </FormField>

      <FormField label="Confirme a senha" error={errors.confirmPassword?.message}>
        <PasswordInput autoComplete="new-password" {...register("confirmPassword")} />
      </FormField>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Criando conta..." : "Criar conta"}
      </Button>

      <p className="text-center text-sm">
        Já tem conta?{" "}
        <Link href={loginHref} className="font-bold text-primary-strong underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </form>
  );
}
