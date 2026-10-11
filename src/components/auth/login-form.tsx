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
import { loginAction } from "@/lib/auth/actions";
import { loginSchema } from "@/lib/validation/auth";

export function LoginForm() {
  const callbackUrl = useSearchParams().get("callbackUrl") ?? undefined;
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await loginAction(values, callbackUrl);
    if (result?.error) setServerError(result.error);
  });

  const signUpHref = callbackUrl ? `/cadastro?${new URLSearchParams({ callbackUrl })}` : "/cadastro";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormAlert message={serverError} />

      <FormField label="E-mail" error={errors.email?.message}>
        <Input type="email" autoComplete="email" inputMode="email" {...register("email")} />
      </FormField>

      <FormField label="Senha" error={errors.password?.message}>
        <PasswordInput autoComplete="current-password" {...register("password")} />
      </FormField>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>

      <p className="text-center text-sm">
        Ainda não tem conta?{" "}
        <Link href={signUpHref} className="font-bold text-primary-strong underline underline-offset-4">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
