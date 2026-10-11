import { z } from "zod";

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .optional()
    .transform((value) => (value ? value : undefined));

/** Cadastro de pet. O porte NÃO vem do formulário: é derivado do peso no servidor. */
export const petSchema = z.object({
  name: z.string({ error: "Informe o nome do pet." }).trim().min(1, "Informe o nome do pet.").max(40, "Nome muito longo."),
  species: z.enum(["CACHORRO", "GATO"], { error: "Escolha cachorro ou gato." }),
  breed: z.string({ error: "Informe a raça." }).trim().min(2, "Informe a raça (ou SRD).").max(40, "Raça muito longa."),
  weightKg: z
    .number({ error: "Informe o peso em kg." })
    .min(0.5, "Peso mínimo de 0,5 kg.")
    .max(100, "Peso máximo de 100 kg.")
    .refine((value) => Number.isInteger(value * 10), "Use no máximo uma casa decimal."),
  birthDate: z
    .union([z.iso.date({ error: "Data inválida." }), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  notes: optionalText(300, "Use no máximo 300 caracteres."),
});

export type PetInput = z.input<typeof petSchema>;

export const vaccineSchema = z
  .object({
    petId: z.string().min(1).max(40),
    name: z.string({ error: "Informe a vacina." }).trim().min(2, "Informe a vacina.").max(40, "Nome muito longo."),
    appliedAt: z.iso.date({ error: "Informe a data de aplicação." }),
    validUntil: z.iso.date({ error: "Informe a validade." }),
  })
  .refine((data) => data.validUntil > data.appliedAt, {
    path: ["validUntil"],
    message: "A validade deve ser depois da aplicação.",
  });

export type VaccineInput = z.input<typeof vaccineSchema>;

export const appointmentIdSchema = z.string().min(1).max(40);
