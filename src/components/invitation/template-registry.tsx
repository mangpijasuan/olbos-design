import type { ComponentType } from "react";
import { LuxuryTemplate } from "@/components/invitation/templates/luxury";
import { ModernTemplate } from "@/components/invitation/templates/modern";
import { FloralTemplate } from "@/components/invitation/templates/floral";
import { MinimalTemplate } from "@/components/invitation/templates/minimal";
import { NavyTemplate } from "@/components/invitation/templates/navy";
import type { InvitationTemplateProps } from "@/components/invitation/types";
import type { TemplateKey } from "@/lib/templates";

export const TEMPLATE_COMPONENTS: Record<TemplateKey, ComponentType<InvitationTemplateProps>> = {
  luxury: LuxuryTemplate,
  modern: ModernTemplate,
  floral: FloralTemplate,
  minimal: MinimalTemplate,
  navy: NavyTemplate,
};

export function getTemplateComponent(key: string) {
  return TEMPLATE_COMPONENTS[key as TemplateKey] ?? LuxuryTemplate;
}
