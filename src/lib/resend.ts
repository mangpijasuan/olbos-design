import { Resend } from "resend";

// The Resend SDK throws at construction time if given an empty string, so we
// fall back to a placeholder key in local/dev environments where email isn't
// configured yet. Callers must check `isEmailConfigured` before sending.
export const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);

export const resend = new Resend(process.env.RESEND_API_KEY || "re_not_configured");

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Olbos Event <invitations@olbosevent.com>";
