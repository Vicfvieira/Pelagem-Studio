"use server";

import { auth } from "@/auth";
import { bookAppointment, type BookingResult } from "@/lib/booking/book";
import { quoteTaxi, type TaxiQuote } from "@/lib/booking/taxi";
import { cepSchema } from "@/lib/validation/booking";

const LOGIN_REQUIRED = "Sua sessão expirou. Entre de novo para continuar.";

/** Passo 4: consulta o CEP e devolve endereço + taxa. Só para usuários logados (não é um proxy aberto do ViaCEP). */
export async function quoteTaxiAction(cep: unknown): Promise<TaxiQuote> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: LOGIN_REQUIRED };

  const parsed = cepSchema.safeParse(cep);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "CEP inválido." };
  return quoteTaxi(parsed.data);
}

/** Passo 5: confirma. Tudo é recalculado no servidor; o cliente só envia as escolhas. */
export async function createAppointmentAction(input: unknown): Promise<BookingResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: LOGIN_REQUIRED };
  return bookAppointment(session.user.id, input);
}
