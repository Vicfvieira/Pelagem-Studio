"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type SessionUser = { name: string | null };

/** Uma consulta por página: os botões do header (desktop e mobile) compartilham a mesma promessa. */
let cached: { pathname: string; promise: Promise<SessionUser | null> } | null = null;

function loadSession(pathname: string): Promise<SessionUser | null> {
  if (cached?.pathname !== pathname) {
    const promise = fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => (response.ok ? (response.json() as Promise<{ user?: { name?: string | null } } | null>) : null))
      .then((session) => (session?.user ? { name: session.user.name ?? null } : null))
      .catch(() => null);
    cached = { pathname, promise };
  }
  return cached.promise;
}

/**
 * Sessão lida no NAVEGADOR, só para decidir quais botões mostrar no header. Assim as páginas públicas
 * ficam 100% estáticas (sem parte dinâmica no servidor). Não é controle de acesso: rotas e ações
 * protegidas continuam conferindo a sessão no servidor. `undefined` = ainda carregando.
 * Refaz a consulta a cada troca de página (ex.: depois de entrar ou sair).
 */
export function useSessionUser(): SessionUser | null | undefined {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    loadSession(pathname).then((value) => {
      if (active) setUser(value);
    });
    return () => {
      active = false;
    };
  }, [pathname]);

  return user;
}
