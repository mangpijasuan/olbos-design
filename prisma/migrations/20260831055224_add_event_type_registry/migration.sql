-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('LIFE_FAMILY', 'CHURCH_FAITH', 'EDUCATION', 'BUSINESS', 'SOCIAL', 'CUSTOM');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "eventTypeId" TEXT;

-- CreateTable
CREATE TABLE "event_types" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_types_key_key" ON "event_types"("key");

-- CreateIndex
CREATE INDEX "event_types_category_idx" ON "event_types"("category");

-- CreateIndex
CREATE INDEX "events_eventTypeId_idx" ON "events"("eventTypeId");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
