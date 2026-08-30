import { test, expect } from "@playwright/test";

test("host signs up, creates an event, publishes it, and a guest can RSVP", async ({ page }) => {
  const stamp = Date.now();
  const email = `e2e-${stamp}@olbosevent.dev`;
  const password = "E2ETestPassword123!";
  const eventTitle = `E2E Test Event ${stamp}`;

  await page.goto("/signup");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Full name").fill("E2E Test Host");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

  await page.getByRole("link", { name: "New event" }).click();
  await expect(page).toHaveURL(/\/dashboard\/events\/new/);

  await page.getByLabel("Event title").fill(eventTitle);
  await page.getByRole("button", { name: "Create event" }).click();

  await expect(page).toHaveURL(/\/dashboard\/events\/[a-z0-9]+$/, { timeout: 15_000 });

  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");
  await page
    .getByRole("button", { name: `Actions for ${eventTitle}` })
    .click();
  await page.getByRole("menuitem", { name: "Publish" }).click();
  await expect(page.getByText("Published").first()).toBeVisible();

  await page.getByRole("link", { name: eventTitle }).click();
  await expect(page).toHaveURL(/\/dashboard\/events\/[a-z0-9]+$/);

  const inviteUrl = await page.getByLabel("Public invitation link").inputValue();

  // Guest visits the public invitation and RSVPs, in a fresh browser context
  // so this is a genuinely unauthenticated request.
  const guestContext = await page.context().browser()!.newContext();
  const guestPage = await guestContext.newPage();
  await guestPage.goto(inviteUrl);
  await guestPage.waitForLoadState("networkidle");

  // New invitations default to an envelope-opening intro that gates the
  // content — open it before interacting with anything underneath.
  const envelopeButton = guestPage.getByRole("button", { name: "Open your invitation" });
  if (await envelopeButton.isVisible().catch(() => false)) {
    await envelopeButton.click();
    await expect(envelopeButton).not.toBeVisible({ timeout: 5_000 });
  }

  await expect(guestPage.getByRole("heading", { name: eventTitle })).toBeVisible();

  await guestPage.getByLabel("Full name").fill("E2E Guest");
  await guestPage.getByLabel("Email (for confirmation)").fill(`guest-${stamp}@example.com`);
  await guestPage.getByRole("button", { name: "Joyfully accept" }).click();
  await guestPage.getByRole("button", { name: "Send RSVP" }).click();

  await expect(guestPage.getByText("Thank you — your RSVP has been received.")).toBeVisible({
    timeout: 10_000,
  });

  await guestContext.close();
});
