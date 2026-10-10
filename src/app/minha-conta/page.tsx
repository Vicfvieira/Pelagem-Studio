import type { Metadata } from "next";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Minha conta" };

async function AccountContent() {
  const user = await requireUser("/minha-conta");
  const firstName = user.name?.split(" ")[0] ?? "tutor(a)";

  return (
    <>
      <h1 className="text-3xl font-black tracking-tight">Olá, {firstName}!</h1>
      <p className="text-muted-foreground">
        Você está conectado(a) como <strong className="text-foreground">{user.email}</strong>. Em breve, aqui
        ficarão seus pets, vacinas e agendamentos.
      </p>
      <form action={signOutAction}>
        <Button type="submit" variant="outline">
          Sair
        </Button>
      </form>
    </>
  );
}

export default function AccountPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-12">
      <Suspense fallback={<p className="text-muted-foreground">Carregando sua conta...</p>}>
        <AccountContent />
      </Suspense>
    </div>
  );
}
