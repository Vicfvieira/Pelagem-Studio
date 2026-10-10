/**
 * Gera uma nova senha aleatória para admin@example.com e mostra no terminal (uma única vez).
 * Útil para testar o painel /equipe quando a senha do primeiro seed se perdeu.
 * Uso: npm run admin:senha
 */
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const password = randomBytes(12).toString("base64url");
  const { count } = await prisma.user.updateMany({
    where: { email: "admin@example.com", role: "ADMIN" },
    data: { passwordHash: await bcrypt.hash(password, 12) },
  });
  if (count === 0) {
    console.log("Admin não encontrado. Rode `npm run db:seed` primeiro.");
    return;
  }
  console.log(`🔑 Nova senha do admin@example.com: ${password}`);
}

main()
  .catch((error: unknown) => {
    console.error("❌ Falha ao trocar a senha:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
