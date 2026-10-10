import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

/**
 * Proxy (antigo middleware no Next 16): só lê o JWT da sessão e aplica `authorized`.
 * Usa a configuração leve, sem banco.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/minha-conta/:path*", "/agendar/:path*", "/entrar", "/cadastro"],
};
