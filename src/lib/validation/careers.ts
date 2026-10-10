import { z } from "zod";

import { JOB_ROLES, JOB_SHIFTS } from "@/content/careers";
import { emailSchema } from "@/lib/validation/auth";

const roleIds = JOB_ROLES.map((role) => role.id) as [(typeof JOB_ROLES)[number]["id"], ...(typeof JOB_ROLES)[number]["id"][]];
const shiftIds = JOB_SHIFTS.map((shift) => shift.id) as [
  (typeof JOB_SHIFTS)[number]["id"],
  ...(typeof JOB_SHIFTS)[number]["id"][],
];

/** Candidatura. O mesmo schema valida no navegador (experiência) e na Server Action (segurança). */
export const jobApplicationSchema = z.object({
  name: z.string({ error: "Informe seu nome." }).trim().min(2, "Informe seu nome completo.").max(80, "Nome muito longo."),
  email: emailSchema,
  phone: z
    .string({ error: "Informe seu celular." })
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((digits) => digits.length === 10 || digits.length === 11, "Celular com DDD, ex.: (11) 91234-5678."),
  role: z.enum(roleIds, { error: "Escolha uma vaga." }),
  shift: z.enum(shiftIds, { error: "Escolha a disponibilidade." }),
  experienceYears: z
    .number({ error: "Informe os anos de experiência (0 se estiver começando)." })
    .int("Use um número inteiro.")
    .min(0, "Não pode ser negativo.")
    .max(50, "Confira os anos de experiência."),
  about: z
    .string({ error: "Conte um pouco sobre você." })
    .trim()
    .min(40, "Escreva pelo menos 40 caracteres.")
    .max(1000, "Use no máximo 1000 caracteres."),
  consent: z.literal(true, { error: "É preciso aceitar para enviarmos sua candidatura." }),
  /** Campo-isca invisível: pessoas não preenchem, robôs sim. */
  website: z.string().max(200).optional(),
});

export type JobApplicationInput = z.input<typeof jobApplicationSchema>;
