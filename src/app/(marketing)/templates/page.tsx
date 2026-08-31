import type { Metadata } from "next";
import { TemplateGallery } from "@/components/marketing/template-gallery";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Browse OLBOS DESIGN's designer invitation templates with live animated background effects and full customization.",
};

export default function TemplatesPage() {
  return <TemplateGallery />;
}
