import "server-only";
import { db } from "@/lib/db";

export async function listEventTypes() {
  return db.eventTypeDefinition.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}
