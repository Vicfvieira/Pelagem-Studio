import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

/** Ações de conta no header. Lê a sessão, por isso é renderizado dentro de <Suspense>. */
export async function AccountActions({ variant }: { variant: "desktop" | "mobile" }) {
  const session = await auth();
  const mobile = variant === "mobile";
  const wrapper = mobile ? "grid grid-cols-2 gap-3" : "flex items-center gap-2";

  if (!session?.user) {
    return (
      <div className={wrapper}>
        <Button asChild variant={mobile ? "outline" : "ghost"}>
          <Link href="/entrar">Entrar</Link>
        </Button>
        <Button asChild>
          <Link href="/agendar">Agendar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(wrapper, mobile && "grid-cols-1")}>
      <Button asChild variant={mobile ? "outline" : "ghost"}>
        <Link href="/minha-conta">
          <UserRound aria-hidden="true" />
          Minha conta
        </Link>
      </Button>
      <Button asChild>
        <Link href="/agendar">Agendar</Link>
      </Button>
      <form action={signOutAction} className={mobile ? "contents" : undefined}>
        <Button type="submit" variant="ghost" size={mobile ? "default" : "icon"} aria-label="Sair da conta">
          <LogOut aria-hidden="true" />
          {mobile && "Sair"}
        </Button>
      </form>
    </div>
  );
}

/** Placeholder do mesmo tamanho enquanto a sessão é lida (evita salto de layout). */
export function AccountActionsFallback({ variant }: { variant: "desktop" | "mobile" }) {
  return variant === "mobile" ? (
    <div className="grid grid-cols-2 gap-3" aria-hidden="true">
      <div className="h-11 rounded-2xl bg-muted" />
      <div className="h-11 rounded-2xl bg-muted" />
    </div>
  ) : (
    <div className="flex items-center gap-2" aria-hidden="true">
      <div className="h-11 w-20 rounded-2xl bg-muted" />
      <div className="h-11 w-24 rounded-2xl bg-muted" />
    </div>
  );
}
