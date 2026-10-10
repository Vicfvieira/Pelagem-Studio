import { redirect } from "next/navigation";
import type { Session } from "next-auth";

import { auth } from "@/auth";

/**
 * Garante usuário logado no servidor. O proxy já redireciona, mas toda página e ação
 * protegida checa de novo: o proxy não deve ser a única barreira.
 */
export async function requireUser(callbackPath: string): Promise<Session["user"]> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/entrar?${new URLSearchParams({ callbackUrl: callbackPath })}`);
  }
  return session.user;
}
