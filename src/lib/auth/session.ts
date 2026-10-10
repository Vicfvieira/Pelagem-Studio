import { redirect } from "next/navigation";
import type { Session } from "next-auth";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

/**
 * Exige um usuário ADMIN, conferindo o papel no BANCO (o papel no token pode estar desatualizado
 * por até 7 dias). Quem não é admin recebe `null` e a página responde 404, sem revelar a rota.
 */
export async function getAdmin(): Promise<{ id: string; name: string } | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, role: true },
  });
  return user?.role === "ADMIN" ? { id: user.id, name: user.name } : null;
}
