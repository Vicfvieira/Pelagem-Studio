import { z } from "zod";

const emailSchema = z
  .string({ error: "Informe seu e-mail." })
  .trim()
  .toLowerCase()
  .min(1, "Informe seu e-mail.")
  .pipe(z.email({ error: "Informe um e-mail válido." }).max(254, "E-mail muito longo."));

export const loginSchema = z.object({
  email: emailSchema,
  // No login não revelamos regras de senha: só exigimos que algo foi digitado.
  password: z.string({ error: "Informe sua senha." }).min(1, "Informe sua senha.").max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** bcrypt ignora o que passa de 72 bytes; limitamos para a senha inteira valer. */
const passwordSchema = z
  .string({ error: "Crie uma senha." })
  .min(8, "A senha precisa ter pelo menos 8 caracteres.")
  .refine((value) => new TextEncoder().encode(value).length <= 72, "A senha pode ter no máximo 72 caracteres.")
  .refine((value) => /[A-Za-zÀ-ÿ]/.test(value) && /\d/.test(value), "Use letras e números na senha.");

export const registerSchema = z
  .object({
    name: z
      .string({ error: "Informe seu nome." })
      .trim()
      .min(2, "Informe seu nome.")
      .max(80, "Nome muito longo."),
    email: emailSchema,
    phone: z
      .string()
      .trim()
      .transform((value) => value.replace(/\D/g, ""))
      .refine((digits) => digits === "" || digits.length === 10 || digits.length === 11, "Telefone com DDD, ex.: (11) 91234-5678.")
      .optional(),
    password: passwordSchema,
    confirmPassword: z.string({ error: "Confirme a senha." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem.",
  });

export type RegisterInput = z.input<typeof registerSchema>;
