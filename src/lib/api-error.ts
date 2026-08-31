import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { UnauthorizedError, ForbiddenError } from "@/server/auth-helpers";
import { CheckInError } from "@/server/checkin-service";
import { BillingError } from "@/server/billing-service";
import { EventTypeError } from "@/server/event-service";
import { ThemeError } from "@/server/theme-service";

export function handleApiError(error: unknown) {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  if (error instanceof ForbiddenError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  if (error instanceof CheckInError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (error instanceof BillingError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (error instanceof EventTypeError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (error instanceof ThemeError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  console.error(error);
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}
