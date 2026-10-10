-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TUTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Species" AS ENUM ('CACHORRO', 'GATO');

-- CreateEnum
CREATE TYPE "PetSize" AS ENUM ('P', 'M', 'G');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('AGENDADO', 'CONCLUIDO', 'CANCELADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'TUTOR',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" "Species" NOT NULL,
    "breed" TEXT NOT NULL,
    "weightKg" DECIMAL(5,2) NOT NULL,
    "size" "PetSize" NOT NULL,
    "birthDate" DATE,
    "notes" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccine" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "appliedAt" DATE NOT NULL,
    "validUntil" DATE NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vaccine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePrice" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "size" "PetSize" NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "durationMinutes" INTEGER NOT NULL,

    CONSTRAINT "ServicePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxiZone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cepStart" INTEGER NOT NULL,
    "cepEnd" INTEGER NOT NULL,
    "feeCents" INTEGER NOT NULL,

    CONSTRAINT "TaxiZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "size" "PetSize" NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "startAt" TIMESTAMPTZ(3) NOT NULL,
    "endAt" TIMESTAMPTZ(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'AGENDADO',
    "taxiZoneId" TEXT,
    "taxiCep" CHAR(8),
    "taxiAddress" TEXT,
    "taxiFeeCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL,
    "notes" TEXT,
    "cancelledAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Pet_ownerId_idx" ON "Pet"("ownerId");

-- CreateIndex
CREATE INDEX "Vaccine_petId_validUntil_idx" ON "Vaccine"("petId", "validUntil");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_active_sortOrder_idx" ON "Service"("active", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePrice_serviceId_size_key" ON "ServicePrice"("serviceId", "size");

-- CreateIndex
CREATE UNIQUE INDEX "TaxiZone_cepStart_key" ON "TaxiZone"("cepStart");

-- CreateIndex
CREATE INDEX "TaxiZone_cepStart_cepEnd_idx" ON "TaxiZone"("cepStart", "cepEnd");

-- CreateIndex
CREATE INDEX "Appointment_status_startAt_endAt_idx" ON "Appointment"("status", "startAt", "endAt");

-- CreateIndex
CREATE INDEX "Appointment_userId_startAt_idx" ON "Appointment"("userId", "startAt");

-- CreateIndex
CREATE INDEX "Appointment_petId_startAt_idx" ON "Appointment"("petId", "startAt");

-- CreateIndex
CREATE INDEX "Appointment_serviceId_idx" ON "Appointment"("serviceId");

-- CreateIndex
CREATE INDEX "Appointment_taxiZoneId_idx" ON "Appointment"("taxiZoneId");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccine" ADD CONSTRAINT "Vaccine_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePrice" ADD CONSTRAINT "ServicePrice_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_taxiZoneId_fkey" FOREIGN KEY ("taxiZoneId") REFERENCES "TaxiZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
