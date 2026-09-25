import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validations";

// ---------------------------------------------------------------------------
// PATCH /api/settings/profile — update display name
// (email is intentionally protected from arbitrary changes)
// ---------------------------------------------------------------------------

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json().catch(() => null);

    const result = profileUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid profile data.",
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: result.data.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
