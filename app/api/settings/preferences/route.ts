import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { preferencesUpdateSchema } from "@/lib/validations";

// ---------------------------------------------------------------------------
// PATCH /api/settings/preferences — currency, theme, notifications
// ---------------------------------------------------------------------------

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json().catch(() => null);

    const result = preferencesUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid preferences data.",
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { currency, theme, notificationsEnabled } = result.data;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        currency,
        ...(theme !== undefined && { theme }),
        ...(notificationsEnabled !== undefined && { notificationsEnabled }),
      },
      select: {
        id: true,
        currency: true,
        theme: true,
        notificationsEnabled: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update preferences error:", error);

    return NextResponse.json(
      { error: "Failed to update preferences." },
      { status: 500 }
    );
  }
}
