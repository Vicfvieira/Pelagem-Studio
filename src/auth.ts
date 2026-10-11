import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation/auth";

/**
 * Hash bcrypt de um valor aleatório descartado. Comparamos contra ele quando o e-mail não existe,
 * para a resposta levar o mesmo tempo e não revelar quais e-mails têm conta.
 */
const TIMING_DUMMY_HASH = "$2b$12$Ez85iEiSGXGOJJGMb8LhLO./Xe8iVaEZpEhB0g8zuxHa9iVaSjin.";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  logger: {
    error(error) {
      // Senha errada é fluxo normal: não polui o log do servidor.
      if (error instanceof CredentialsSignin) return;
      console.error(error);
    },
  },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, name: true, email: true, role: true, passwordHash: true },
        });

        const valid = await bcrypt.compare(password, user?.passwordHash ?? TIMING_DUMMY_HASH);
        if (!user || !valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
});
