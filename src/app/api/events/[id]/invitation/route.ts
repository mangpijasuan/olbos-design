import { NextResponse, type NextRequest } from "next/server";
import { updateInvitationSchema } from "@/validations/invitation";
import { updateInvitation } from "@/server/invitation-service";
import { handleApiError } from "@/lib/api-error";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const json = await request.json();
    const input = updateInvitationSchema.parse(json);
    const invitation = await updateInvitation(id, input);
    return NextResponse.json({ invitation });
  } catch (error) {
    return handleApiError(error);
  }
}
