-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_eventTypeId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "type",
ALTER COLUMN "eventTypeId" SET NOT NULL;

-- DropEnum
DROP TYPE "EventType";

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

