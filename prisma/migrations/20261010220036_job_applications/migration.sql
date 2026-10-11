-- CreateEnum
CREATE TYPE "JobRole" AS ENUM ('BANHISTA', 'TOSADOR', 'RECEPCAO', 'MOTORISTA');

-- CreateEnum
CREATE TYPE "JobShift" AS ENUM ('INTEGRAL', 'MANHA', 'TARDE');

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "JobRole" NOT NULL,
    "shift" "JobShift" NOT NULL,
    "experienceYears" INTEGER NOT NULL,
    "about" TEXT NOT NULL,
    "consentAt" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobApplication_createdAt_idx" ON "JobApplication"("createdAt");

-- CreateIndex
CREATE INDEX "JobApplication_role_createdAt_idx" ON "JobApplication"("role", "createdAt");
