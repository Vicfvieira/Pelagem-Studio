import type { AppointmentStatus, PetSize, Species } from "@prisma/client";

import {
  BATH_SERVICE_SLUGS,
  canCancel,
  suggestNextBath,
  vaccineStatus,
  type NextBathSuggestion,
  type VaccineStatus,
} from "@/lib/account/rules";
import { toSaoPauloDate } from "@/lib/business-rules";
import { prisma } from "@/lib/prisma";

const HISTORY_LIMIT = 12;

export type AccountPet = {
  id: string;
  name: string;
  species: Species;
  breed: string;
  size: PetSize;
  weightKg: number;
  /** `superseded`: existe uma dose mais recente da mesma vacina (não gera alerta). */
  vaccines: Array<{ id: string; name: string; appliedAt: string; validUntil: string; superseded: boolean } & VaccineStatus>;
  nextBath: NextBathSuggestion;
};

export type AccountAppointment = {
  id: string;
  petName: string;
  serviceName: string;
  startAt: string;
  totalCents: number;
  taxi: boolean;
  status: AppointmentStatus;
  cancellable: boolean;
};

export type AccountOverview = {
  pets: AccountPet[];
  upcoming: AccountAppointment[];
  history: AccountAppointment[];
  historyTotal: number;
  vaccineAlerts: number;
};

const dateOnly = (value: Date) => value.toISOString().slice(0, 10);

/** Tudo o que /minha-conta mostra, SEMPRE filtrado pelo dono (userId da sessão). */
export async function getAccountOverview(userId: string, now = new Date()): Promise<AccountOverview> {
  const today = toSaoPauloDate(now);
  const appointmentSelect = {
    id: true,
    startAt: true,
    totalCents: true,
    taxiFeeCents: true,
    status: true,
    pet: { select: { name: true } },
    service: { select: { name: true } },
  } as const;
  const bathFilter = { service: { slug: { in: [...BATH_SERVICE_SLUGS] } } };

  const [pets, upcoming, history, historyTotal, lastBaths, nextBaths] = await Promise.all([
    prisma.pet.findMany({
      where: { ownerId: userId },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        species: true,
        breed: true,
        size: true,
        weightKg: true,
        vaccines: { orderBy: { validUntil: "asc" }, select: { id: true, name: true, appliedAt: true, validUntil: true } },
      },
    }),
    prisma.appointment.findMany({
      where: { userId, status: "AGENDADO", startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      select: appointmentSelect,
    }),
    prisma.appointment.findMany({
      where: { userId, OR: [{ startAt: { lt: now } }, { status: { not: "AGENDADO" } }] },
      orderBy: { startAt: "desc" },
      take: HISTORY_LIMIT,
      select: appointmentSelect,
    }),
    prisma.appointment.count({
      where: { userId, OR: [{ startAt: { lt: now } }, { status: { not: "AGENDADO" } }] },
    }),
    // Último banho concluído de cada pet.
    prisma.appointment.findMany({
      where: { userId, status: "CONCLUIDO", ...bathFilter },
      orderBy: { startAt: "desc" },
      distinct: ["petId"],
      select: { petId: true, startAt: true },
    }),
    // Próximo banho já agendado de cada pet.
    prisma.appointment.findMany({
      where: { userId, status: "AGENDADO", startAt: { gte: now }, ...bathFilter },
      orderBy: { startAt: "asc" },
      distinct: ["petId"],
      select: { petId: true, startAt: true },
    }),
  ]);

  const lastBathByPet = new Map(lastBaths.map((a) => [a.petId, toSaoPauloDate(a.startAt)]));
  const nextBathByPet = new Map(nextBaths.map((a) => [a.petId, toSaoPauloDate(a.startAt)]));

  const accountPets: AccountPet[] = pets.map((pet) => ({
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    size: pet.size,
    weightKg: Number(pet.weightKg),
    vaccines: pet.vaccines.map((v, index, all) => {
      const validUntil = dateOnly(v.validUntil);
      // Lista ordenada por validade: se houver outra dose da mesma vacina depois desta, esta foi substituída.
      const superseded = all.slice(index + 1).some((other) => other.name.toLowerCase() === v.name.toLowerCase());
      return {
        id: v.id,
        name: v.name,
        appliedAt: dateOnly(v.appliedAt),
        validUntil,
        superseded,
        ...vaccineStatus(validUntil, today),
      };
    }),
    nextBath: suggestNextBath({
      lastCompletedBathDate: lastBathByPet.get(pet.id) ?? null,
      nextScheduledBathDate: nextBathByPet.get(pet.id) ?? null,
      today,
    }),
  }));

  const toView = (a: (typeof upcoming)[number]): AccountAppointment => ({
    id: a.id,
    petName: a.pet.name,
    serviceName: a.service.name,
    startAt: a.startAt.toISOString(),
    totalCents: a.totalCents,
    taxi: a.taxiFeeCents > 0,
    status: a.status,
    cancellable: a.status === "AGENDADO" && canCancel(a.startAt, now),
  });

  return {
    pets: accountPets,
    upcoming: upcoming.map(toView),
    history: history.map(toView),
    historyTotal,
    vaccineAlerts: accountPets.reduce(
      (total, pet) => total + pet.vaccines.filter((v) => !v.superseded && v.status !== "EM_DIA").length,
      0,
    ),
  };
}
