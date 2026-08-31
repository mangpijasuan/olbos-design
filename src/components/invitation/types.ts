import type { InvitationContent } from "@/validations/invitation";
import type { ThemeTokens } from "@/validations/theme";

export interface InvitationEventInfo {
  title: string;
  type: string;
  startAt: string | Date;
  endAt?: string | Date | null;
  venueName?: string | null;
  venueAddress?: string | null;
  venueLat?: number | null;
  venueLng?: number | null;
  coverImageUrl?: string | null;
}

export interface InvitationTemplateProps {
  event: InvitationEventInfo;
  content: InvitationContent;
  theme: ThemeTokens;
  musicUrl?: string | null;
  rsvpSlot?: React.ReactNode;
}
