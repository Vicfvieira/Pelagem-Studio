import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCard, FormSkeleton } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entre na sua conta do Pelagem Studio para agendar e acompanhar os banhos do seu pet.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <AuthCard title="Que bom te ver!" description="Entre para agendar e acompanhar os cuidados do seu pet.">
      <Suspense fallback={<FormSkeleton fields={2} />}>
        <LoginForm />
      </Suspense>
      <p className="mt-6 rounded-2xl bg-muted p-3 text-center text-xs text-muted-foreground">
        Conta de demonstração: <strong className="text-foreground">demo@example.com</strong> /{" "}
        <strong className="text-foreground">pelagem-demo</strong>
      </p>
    </AuthCard>
  );
}
