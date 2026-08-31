/*
  Warnings:

  - Made the column `themeId` on table `invitations` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_themeId_fkey";

-- AlterTable
ALTER TABLE "invitations" ALTER COLUMN "themeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
