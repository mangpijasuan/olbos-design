import "server-only";
import { db } from "@/lib/db";
import { requireEventAccess } from "@/server/auth-helpers";
import { getTemplateDefinition } from "@/lib/templates";
import { resolveTheme } from "@/server/theme-service";
import type { UpdateInvitationPayload } from "@/validations/invitation";

export async function updateInvitation(eventId: string, input: UpdateInvitationPayload) {
  const { event } = await requireEventAccess(eventId);

  let templateId: string | undefined;
  if (input.templateKey) {
    const def = getTemplateDefinition(input.templateKey);
    const template = await db.template.upsert({
      where: { key: def.key },
      update: {},
      create: {
        key: def.key,
        name: def.name,
        category: def.category,
        description: def.description,
        previewImage: def.swatch,
      },
    });
    templateId = template.id;
  }

  let themeUpdate: { themeId: string; theme: object } | undefined;
  if (input.themeKey) {
    const theme = await resolveTheme(input.themeKey);
    themeUpdate = { themeId: theme.id, theme: theme.tokens as object };
  }

  return db.invitation.update({
    where: { eventId: event.id },
    data: {
      ...(templateId ? { templateId } : {}),
      ...(themeUpdate ?? {}),
      ...(input.content ? { content: input.content } : {}),
      ...(input.musicUrl !== undefined ? { musicUrl: input.musicUrl || null } : {}),
    },
    include: { template: true, selectedTheme: true },
  });
}
