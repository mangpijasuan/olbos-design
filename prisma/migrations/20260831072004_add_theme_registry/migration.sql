-- AlterTable
ALTER TABLE "invitations" ADD COLUMN     "themeId" TEXT;

-- CreateTable
CREATE TABLE "themes" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "TemplateCategory" NOT NULL,
    "tokens" JSONB NOT NULL,
    "swatch" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "themes_key_key" ON "themes"("key");

-- CreateIndex
CREATE INDEX "themes_category_idx" ON "themes"("category");

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
