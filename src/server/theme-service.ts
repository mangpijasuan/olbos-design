import "server-only";
import { db } from "@/lib/db";

export class ThemeError extends Error {
  constructor(message = "Unknown theme") {
    super(message);
    this.name = "ThemeError";
  }
}

export async function listThemes() {
  return db.theme.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

export async function resolveTheme(key: string) {
  const theme = await db.theme.findUnique({ where: { key } });
  if (!theme) throw new ThemeError(`Unknown theme: ${key}`);
  return theme;
}
