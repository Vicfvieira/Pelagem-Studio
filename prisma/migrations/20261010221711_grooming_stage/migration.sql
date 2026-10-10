-- CreateEnum
CREATE TYPE "GroomingStage" AS ENUM ('RECEBIDO', 'BANHO', 'SECAGEM', 'TOSA', 'PRONTO');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "groomingStage" "GroomingStage",
ADD COLUMN     "stageUpdatedAt" TIMESTAMPTZ(3);
