import "server-only";
import { db } from "@/lib/db";
import { requireEventAccess } from "@/server/auth-helpers";
import { getTemplateDefinition } from "@/lib/templates";
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

  return db.invitation.update({
    where: { eventId: event.id },
    data: {
      ...(templateId ? { templateId } : {}),
      ...(input.content ? { content: input.content } : {}),
      ...(input.musicUrl !== undefined ? { musicUrl: input.musicUrl || null } : {}),
    },
    include: { template: true },
  });
}
