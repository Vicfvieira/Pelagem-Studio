import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCard, FormSkeleton } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta no Pelagem Studio e agende banho e tosa online.",
};

export default function RegisterPage() {
  return (
    <AuthCard title="Crie sua conta" description="Leva um minuto. Depois é só cadastrar seu pet e agendar.">
      <Suspense fallback={<FormSkeleton fields={5} />}>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
