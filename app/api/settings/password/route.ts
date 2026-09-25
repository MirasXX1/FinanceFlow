import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { passwordChangeSchema } from "@/lib/validations";

// ---------------------------------------------------------------------------
// PATCH /api/settings/password — change password (authenticated users only)
// ---------------------------------------------------------------------------

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json().catch(() => null);

    const result = passwordChangeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid password data.",
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = result.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, passwordHash: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "This account has no password set." },
        { status: 400 }
      );
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const isSameAsCurrent = await bcrypt.compare(newPassword, user.passwordHash);

    if (isSameAsCurrent) {
      return NextResponse.json(
        { error: "New password must be different from the current one." },
        { status: 400 }
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);

    return NextResponse.json(
      { error: "Failed to change password." },
      { status: 500 }
    );
  }
}
