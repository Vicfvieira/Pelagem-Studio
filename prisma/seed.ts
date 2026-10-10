/**
 * Seed idempotente do Pelagem Studio.
 *
 * - Catálogo (serviços, preços, zonas do táxi dog): upsert por chave natural.
 * - Tutores fictícios: upsert por e-mail (@example.com, domínio reservado pela RFC 2606).
 *   Pets, vacinas e agendamentos DELES são apagados e recriados; contas reais não são tocadas.
 * - faker com semente fixa: rodar duas vezes no mesmo dia gera os mesmos dados.
 * - Agendamentos respeitam terça a sábado, 9h–18h, slots de 30 min e capacidade 2 por slot,
 *   contando também os agendamentos ativos de contas reais já existentes.
 */
import { randomBytes } from "node:crypto";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { PrismaClient, type AppointmentStatus, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  CLOSE_MINUTE,
  NEXT_BATH_DAYS,
  OPEN_MINUTE,
  OPEN_WEEKDAYS,
  SLOT_CAPACITY,
  SLOT_MINUTES,
  addDaysToDate,
  saoPauloDateTime,
  sizeFromWeight,
  toSaoPauloDate,
  toSaoPauloTime,
  weekdayOf,
  type PetSizeCode,
} from "../src/lib/business-rules";
import {
  CAT_BREEDS,
  CAT_VACCINES,
  DOG_BREEDS,
  DOG_VACCINES,
  PET_NAMES,
  SERVICES,
  TAXI_ZONES,
} from "./seed-data";

const prisma = new PrismaClient();

const FAKER_SEED = 2026;
const TUTOR_COUNT = 40;
const PET_COUNT = 60;
const PAST_APPOINTMENTS = 250;
const FUTURE_APPOINTMENTS = 50;
const PAST_DAYS = 183; // ~6 meses
const FUTURE_DAYS = 14;
const TAXI_PROBABILITY = 0.25;
const CANCEL_PROBABILITY = 0.1;

const SEED_EMAIL_DOMAIN = "example.com";
/** Conta pública de demonstração para recrutadores (sem nenhum privilégio). */
const DEMO_TUTOR = { name: "Tutora Demo", email: "demo@example.com", password: "pelagem-demo" };
const ADMIN_EMAIL = "admin@example.com";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

type CatalogService = {
  id: string;
  slug: string;
  prices: Record<PetSizeCode, { priceCents: number; durationMinutes: number }>;
};
type SeedPet = { id: string; ownerId: string; size: PetSizeCode };
type CatalogZone = { id: string; cepStart: number; cepEnd: number; feeCents: number };

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "");
}

/** Data local "yyyy-MM-dd" como valor de coluna @db.Date. */
function asDbDate(localDate: string): Date {
  return new Date(`${localDate}T00:00:00.000Z`);
}

async function seedCatalog(): Promise<{ services: CatalogService[]; zones: CatalogZone[] }> {
  const services: CatalogService[] = [];

  for (const [index, item] of SERVICES.entries()) {
    const service = await prisma.service.upsert({
      where: { slug: item.slug },
      update: { name: item.name, description: item.description, sortOrder: index, active: true },
      create: { slug: item.slug, name: item.name, description: item.description, sortOrder: index },
    });

    for (const size of ["P", "M", "G"] as const) {
      const { priceCents, durationMinutes } = item.prices[size];
      await prisma.servicePrice.upsert({
        where: { serviceId_size: { serviceId: service.id, size } },
        update: { priceCents, durationMinutes },
        create: { serviceId: service.id, size, priceCents, durationMinutes },
      });
    }

    services.push({ id: service.id, slug: service.slug, prices: item.prices });
  }

  const zones: CatalogZone[] = [];
  for (const zone of TAXI_ZONES) {
    zones.push(
      await prisma.taxiZone.upsert({
        where: { cepStart: zone.cepStart },
        update: { name: zone.name, cepEnd: zone.cepEnd, feeCents: zone.feeCents },
        create: zone,
      }),
    );
  }

  return { services, zones };
}

/** Admin criado só uma vez, com senha aleatória exibida no terminal (nunca fixa no código). */
async function seedAdmin(): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) return;

  const password = randomBytes(12).toString("base64url");
  await prisma.user.create({
    data: {
      name: "Administração Pelagem",
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });
  console.log(`👤 Admin criado: ${ADMIN_EMAIL} / ${password}  (guarde agora, não será exibida de novo)`);
}

async function seedTutors(): Promise<string[]> {
  const demoHash = await bcrypt.hash(DEMO_TUTOR.password, 12);
  // Tutores fictícios recebem o hash de uma senha aleatória descartada: ninguém entra com eles.
  const lockedHash = await bcrypt.hash(randomBytes(32).toString("hex"), 12);

  const tutors = [
    { name: DEMO_TUTOR.name, email: DEMO_TUTOR.email, phone: "(11) 90000-0000", passwordHash: demoHash },
  ];
  for (let i = 1; i < TUTOR_COUNT; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    tutors.push({
      name: `${firstName} ${lastName}`,
      email: `${slugify(firstName)}.${slugify(lastName)}${i}@${SEED_EMAIL_DOMAIN}`,
      phone: `(11) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
      passwordHash: lockedHash,
    });
  }

  const ids: string[] = [];
  for (const tutor of tutors) {
    const user = await prisma.user.upsert({
      where: { email: tutor.email },
      update: { name: tutor.name, phone: tutor.phone },
      create: { ...tutor, role: "TUTOR" },
    });
    ids.push(user.id);
  }
  return ids;
}

function buildPets(tutorIds: string[], today: string): Prisma.PetCreateManyInput[] {
  // Todo tutor tem 1 pet; os primeiros (incluindo a conta demo) ganham um segundo.
  const owners = [...tutorIds, ...tutorIds.slice(0, PET_COUNT - tutorIds.length)];

  return owners.map((ownerId, index) => {
    const isDog = faker.datatype.boolean({ probability: 0.8 });
    const { breed, minKg, maxKg } = faker.helpers.arrayElement(isDog ? DOG_BREEDS : CAT_BREEDS);
    const weightKg = faker.number.float({ min: minKg, max: maxKg, fractionDigits: 1 });
    const ageDays = faker.number.int({ min: 180, max: 14 * 365 });

    return {
      ownerId,
      name: PET_NAMES[index % PET_NAMES.length],
      species: isDog ? "CACHORRO" : "GATO",
      breed,
      weightKg,
      size: sizeFromWeight(weightKg),
      birthDate: asDbDate(addDaysToDate(today, -ageDays)),
      notes: faker.helpers.maybe(
        () => faker.helpers.arrayElement(["Tem medo do secador.", "Pele sensível.", "Muito agitado no início."]),
        { probability: 0.3 },
      ),
    };
  });
}

function buildVaccines(
  pets: Array<{ id: string; species: "CACHORRO" | "GATO" }>,
  today: string,
): Prisma.VaccineCreateManyInput[] {
  return pets.flatMap((pet) => {
    const pool = pet.species === "CACHORRO" ? DOG_VACCINES : CAT_VACCINES;
    const names = faker.helpers.arrayElements(pool, { min: 2, max: pool.length });
    return names.map((name) => {
      // Aplicadas entre 14 meses e 1 mês atrás: algumas já vencidas, para os alertas da carteirinha.
      const appliedAt = addDaysToDate(today, -faker.number.int({ min: 30, max: 425 }));
      return {
        petId: pet.id,
        name,
        appliedAt: asDbDate(appliedAt),
        validUntil: asDbDate(addDaysToDate(appliedAt, 365)),
      };
    });
  });
}

/** Controle de ocupação: quantos atendimentos ativos começam/ocupam cada slot, e agenda de cada pet. */
class Agenda {
  private slotLoad = new Map<number, number>();
  private petIntervals = new Map<string, Array<[number, number]>>();

  private static slotsOf(startAt: Date, durationMinutes: number): number[] {
    const slots: number[] = [];
    for (let offset = 0; offset < durationMinutes; offset += SLOT_MINUTES) {
      slots.push(startAt.getTime() + offset * 60_000);
    }
    return slots;
  }

  fits(petId: string, startAt: Date, durationMinutes: number): boolean {
    const start = startAt.getTime();
    const end = start + durationMinutes * 60_000;
    const petBusy = (this.petIntervals.get(petId) ?? []).some(([s, e]) => start < e && s < end);
    if (petBusy) return false;
    return Agenda.slotsOf(startAt, durationMinutes).every(
      (slot) => (this.slotLoad.get(slot) ?? 0) < SLOT_CAPACITY,
    );
  }

  occupy(petId: string, startAt: Date, durationMinutes: number): void {
    for (const slot of Agenda.slotsOf(startAt, durationMinutes)) {
      this.slotLoad.set(slot, (this.slotLoad.get(slot) ?? 0) + 1);
    }
    const start = startAt.getTime();
    const intervals = this.petIntervals.get(petId) ?? [];
    intervals.push([start, start + durationMinutes * 60_000]);
    this.petIntervals.set(petId, intervals);
  }
}

function businessDays(from: string, to: string): string[] {
  const days: string[] = [];
  for (let day = from; day <= to; day = addDaysToDate(day, 1)) {
    if (OPEN_WEEKDAYS.includes(weekdayOf(day))) days.push(day);
  }
  return days;
}

const SERVICE_WEIGHTS: Record<string, number> = {
  banho: 35,
  "banho-tosa-higienica": 25,
  "tosa-completa": 15,
  hidratacao: 10,
  "corte-de-unhas": 15,
};

type Placement = {
  pets: SeedPet[];
  days: string[];
  services: CatalogService[];
  status: "past" | "future";
  forceStatus?: AppointmentStatus;
};

function placeAppointment(
  agenda: Agenda,
  zones: CatalogZone[],
  now: Date,
  { pets, days, services, status, forceStatus }: Placement,
): Prisma.AppointmentCreateManyInput {
  for (let attempt = 0; attempt < 200; attempt++) {
    const pet = faker.helpers.arrayElement(pets);
    const day = faker.helpers.arrayElement(days);
    const service = faker.helpers.weightedArrayElement(
      services.map((s) => ({ value: s, weight: SERVICE_WEIGHTS[s.slug] ?? 1 })),
    );
    const { priceCents, durationMinutes } = service.prices[pet.size];

    // Último início possível para terminar até o fechamento.
    const lastStartSlot = (CLOSE_MINUTE - durationMinutes - OPEN_MINUTE) / SLOT_MINUTES;
    const startMinute = OPEN_MINUTE + faker.number.int({ min: 0, max: lastStartSlot }) * SLOT_MINUTES;
    const startAt = saoPauloDateTime(day, startMinute);

    const cancelled = forceStatus
      ? forceStatus === "CANCELADO"
      : faker.datatype.boolean({ probability: CANCEL_PROBABILITY });
    // Cancelados não ocupam vaga; os demais precisam caber na capacidade.
    if (!cancelled && !agenda.fits(pet.id, startAt, durationMinutes)) continue;
    if (!cancelled) agenda.occupy(pet.id, startAt, durationMinutes);

    const finalStatus: AppointmentStatus = cancelled
      ? "CANCELADO"
      : status === "past"
        ? "CONCLUIDO"
        : "AGENDADO";

    // Reservas são feitas com até 30 dias de antecedência e nunca depois de "agora".
    const leadMs = faker.number.int({ min: 1, max: 20 }) * DAY_MS;
    const createdAt = new Date(Math.min(startAt.getTime() - leadMs, now.getTime() - HOUR_MS));
    // Cancelamento respeita a regra das 24h de antecedência.
    const cancelledAt = cancelled
      ? new Date(
          Math.min(
            startAt.getTime() - faker.number.int({ min: 25, max: 72 }) * HOUR_MS,
            now.getTime(),
          ),
        )
      : null;

    const zone = faker.datatype.boolean({ probability: TAXI_PROBABILITY })
      ? faker.helpers.arrayElement(zones)
      : null;
    const taxiFeeCents = zone?.feeCents ?? 0;

    return {
      userId: pet.ownerId,
      petId: pet.id,
      serviceId: service.id,
      size: pet.size,
      priceCents,
      durationMinutes,
      startAt,
      endAt: new Date(startAt.getTime() + durationMinutes * 60_000),
      status: finalStatus,
      taxiZoneId: zone?.id ?? null,
      taxiCep: zone
        ? String(faker.number.int({ min: zone.cepStart, max: zone.cepEnd })).padStart(8, "0")
        : null,
      taxiAddress: zone ? `${faker.location.streetAddress()}, São Paulo - SP` : null,
      taxiFeeCents,
      totalCents: priceCents + taxiFeeCents,
      cancelledAt: cancelledAt && cancelledAt < createdAt ? createdAt : cancelledAt,
      createdAt,
    };
  }
  throw new Error("Não foi possível encaixar um agendamento: agenda lotada no período.");
}

/**
 * Conta demo: um banho de HOJE já em andamento, para o "Acompanhe o banho" ter o que mostrar.
 * Começa no slot anterior ao horário atual (dentro do expediente) e respeita a capacidade.
 * Em dia fechado (domingo/segunda) não há atendimento ao vivo.
 */
function placeLiveAppointment(
  agenda: Agenda,
  now: Date,
  today: string,
  pets: SeedPet[],
  services: CatalogService[],
): Prisma.AppointmentCreateManyInput | null {
  const bath = services.find((s) => s.slug === "banho");
  if (!bath || !OPEN_WEEKDAYS.includes(weekdayOf(today))) return null;

  const [hours, minutes] = toSaoPauloTime(now).split(":").map(Number);
  const nowSlot = Math.floor((hours * 60 + minutes) / SLOT_MINUTES) * SLOT_MINUTES;
  for (const pet of pets) {
    const { priceCents, durationMinutes } = bath.prices[pet.size];
    const latest = CLOSE_MINUTE - durationMinutes;
    const desired = Math.min(Math.max(nowSlot - SLOT_MINUTES, OPEN_MINUTE), latest);
    // Tenta o horário desejado e, se lotado, os anteriores.
    for (let start = desired; start >= OPEN_MINUTE; start -= SLOT_MINUTES) {
      const startAt = saoPauloDateTime(today, start);
      if (!agenda.fits(pet.id, startAt, durationMinutes)) continue;
      agenda.occupy(pet.id, startAt, durationMinutes);
      return {
        userId: pet.ownerId,
        petId: pet.id,
        serviceId: bath.id,
        size: pet.size,
        priceCents,
        durationMinutes,
        startAt,
        endAt: new Date(startAt.getTime() + durationMinutes * 60_000),
        status: "AGENDADO",
        groomingStage: "SECAGEM",
        stageUpdatedAt: new Date(now.getTime() - 6 * 60_000),
        taxiFeeCents: 0,
        totalCents: priceCents,
        createdAt: new Date(startAt.getTime() - 3 * DAY_MS),
      };
    }
  }
  return null;
}

async function main(): Promise<void> {
  faker.seed(FAKER_SEED);
  const now = new Date();
  const today = toSaoPauloDate(now);

  const { services, zones } = await seedCatalog();
  await seedAdmin();
  const tutorIds = await seedTutors();

  const pastDays = businessDays(addDaysToDate(today, -PAST_DAYS), addDaysToDate(today, -1));
  const futureDays = businessDays(addDaysToDate(today, 1), addDaysToDate(today, FUTURE_DAYS));

  const result = await prisma.$transaction(
    async (tx) => {
      // Recria apenas os dados dos tutores fictícios (vacinas caem em cascata com os pets).
      await tx.appointment.deleteMany({ where: { userId: { in: tutorIds } } });
      await tx.pet.deleteMany({ where: { ownerId: { in: tutorIds } } });

      const pets = await tx.pet.createManyAndReturn({
        data: buildPets(tutorIds, today),
        select: { id: true, ownerId: true, size: true, species: true },
      });
      const vaccines = await tx.vaccine.createMany({ data: buildVaccines(pets, today) });

      // Agendamentos ativos de contas reais também contam na capacidade.
      const agenda = new Agenda();
      const existing = await tx.appointment.findMany({
        where: {
          status: { not: "CANCELADO" },
          startAt: { gte: saoPauloDateTime(pastDays[0], 0) },
        },
        select: { petId: true, startAt: true, durationMinutes: true },
      });
      for (const a of existing) agenda.occupy(a.petId, a.startAt, a.durationMinutes);

      const appointments: Prisma.AppointmentCreateManyInput[] = [];

      // Conta demo: um banho concluído recente (card de próximo banho) e um agendamento futuro.
      const demoPets = pets.filter((p) => p.ownerId === tutorIds[0]);
      const bath = services.filter((s) => s.slug === "banho");
      const recentDays = pastDays.filter((d) => d >= addDaysToDate(today, -NEXT_BATH_DAYS + 3));
      appointments.push(
        placeAppointment(agenda, zones, now, {
          pets: demoPets.slice(0, 1),
          days: recentDays.length > 0 ? recentDays : pastDays,
          services: bath,
          status: "past",
          forceStatus: "CONCLUIDO",
        }),
        placeAppointment(agenda, zones, now, {
          pets: demoPets.slice(1),
          days: futureDays.slice(2),
          services,
          status: "future",
          forceStatus: "AGENDADO",
        }),
      );

      const live = placeLiveAppointment(agenda, now, today, [...demoPets].reverse(), services);
      if (live) appointments.push(live);
      else console.log("ℹ️  Estúdio fechado hoje: a conta demo fica sem atendimento ao vivo.");

      for (let i = appointments.length; i < PAST_APPOINTMENTS + FUTURE_APPOINTMENTS; i++) {
        const isPast = i < PAST_APPOINTMENTS;
        appointments.push(
          placeAppointment(agenda, zones, now, {
            pets,
            days: isPast ? pastDays : futureDays,
            services,
            status: isPast ? "past" : "future",
          }),
        );
      }

      const created = await tx.appointment.createMany({ data: appointments });
      return { pets: pets.length, vaccines: vaccines.count, appointments: created.count };
    },
    { timeout: 60_000, maxWait: 10_000 },
  );

  console.log(
    `🌱 Seed concluído: ${services.length} serviços, ${zones.length} faixas de CEP, ` +
      `${tutorIds.length} tutores, ${result.pets} pets, ${result.vaccines} vacinas, ` +
      `${result.appointments} agendamentos.`,
  );
  console.log(`🔑 Conta demo: ${DEMO_TUTOR.email} / ${DEMO_TUTOR.password}`);
}

main()
  .catch((error: unknown) => {
    console.error("❌ Falha no seed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
