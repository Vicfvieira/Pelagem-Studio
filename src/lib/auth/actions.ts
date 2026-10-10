"use server";

import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { safeCallbackUrl } from "@/lib/auth/redirect";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validation/auth";

export type AuthActionResult = { error: string } | undefined;

/** Mesma mensagem para e-mail inexistente e senha errada: não revela quem tem conta. */
const LOGIN_ERROR = "E-mail ou senha incorretos.";
const REGISTER_ERROR =
  "Não foi possível criar a conta com esses dados. Se você já tem cadastro, entre com seu e-mail e senha.";

export async function loginAction(input: unknown, callbackUrl?: string): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: LOGIN_ERROR };

  try {
    // Em caso de sucesso, signIn lança o redirect do Next (não é capturado abaixo).
    await signIn("credentials", { ...parsed.data, redirectTo: safeCallbackUrl(callbackUrl) });
  } catch (error) {
    if (error instanceof AuthError) return { error: LOGIN_ERROR };
    throw error;
  }
}

export async function registerAction(input: unknown, callbackUrl?: string): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? REGISTER_ERROR };
  const { name, email, phone, password } = parsed.data;

  // O hash vem antes da checagem: e-mail novo e existente levam o mesmo tempo (sem enumeração).
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return { error: REGISTER_ERROR };

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        // O papel nunca vem do formulário.
        role: "TUTOR",
      },
    });
  } catch (error) {
    // E-mail já cadastrado (inclusive em corrida entre dois envios): mensagem genérica.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: REGISTER_ERROR };
    }
    throw error;
  }

  try {
    await signIn("credentials", { email, password, redirectTo: safeCallbackUrl(callbackUrl) });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Conta criada! Entre com seu e-mail e senha." };
    throw error;
  }
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
