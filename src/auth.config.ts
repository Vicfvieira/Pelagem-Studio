import type { NextAuthConfig } from "next-auth";

import { safeCallbackUrl } from "@/lib/auth/redirect";

/** Rotas que exigem login. O proxy redireciona; as páginas checam de novo (defesa em profundidade). */
export const PROTECTED_PREFIXES = ["/minha-conta", "/agendar"];
const AUTH_PAGES = ["/entrar", "/cadastro"];

function matches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * Configuração leve (sem Prisma nem bcrypt), usada pelo proxy.
 * O provider de credenciais fica em src/auth.ts.
 */
export const authConfig = {
  pages: { signIn: "/entrar" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  // A Vercel define o host correto; necessário também para `next start` local.
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const loggedIn = Boolean(auth?.user);

      if (matches(nextUrl.pathname, PROTECTED_PREFIXES) && !loggedIn) {
        const login = new URL("/entrar", nextUrl);
        login.searchParams.set("callbackUrl", `${nextUrl.pathname}${nextUrl.search}`);
        return Response.redirect(login);
      }

      // Quem já está logado não precisa ver /entrar nem /cadastro.
      if (matches(nextUrl.pathname, AUTH_PAGES) && loggedIn) {
        const target = safeCallbackUrl(nextUrl.searchParams.get("callbackUrl"));
        return Response.redirect(new URL(target, nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      // `user` só existe no login: copiamos id e papel para o token assinado.
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
