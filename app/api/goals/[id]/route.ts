import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dateToUtcNoon, round2 } from "@/lib/format";
import { goalUpdateSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

async function findOwnedGoal(userId: string, id: string) {
  if (!id || id.length > 40) {
    return null;
  }

  return prisma.financialGoal.findFirst({
    where: {
      id,
      userId,
    },
  });
}

// ---------------------------------------------------------------------------
// PATCH /api/goals/[id] — update an owned goal
// ---------------------------------------------------------------------------

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await findOwnedGoal(session.user.id, id);

    if (!existing) {
      return NextResponse.json({ error: "Goal not found." }, { status: 404 });
    }

    const body: unknown = await request.json().catch(() => null);

    const result = goalUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid goal data.",
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, targetAmount, currentAmount, deadline, color } = result.data;

    const goal = await prisma.financialGoal.update({
      where: { id: existing.id },
      data: {
        ...(name !== undefined && { name }),
        ...(targetAmount !== undefined && { targetAmount: round2(targetAmount) }),
        ...(currentAmount !== undefined && { currentAmount: round2(currentAmount) }),
        ...(deadline !== undefined && {
          deadline: deadline ? dateToUtcNoon(deadline) : null,
        }),
        ...(color !== undefined && { color: color || null }),
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Update goal error:", error);

    return NextResponse.json(
      { error: "Failed to update goal." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/goals/[id] — delete an owned goal
// ---------------------------------------------------------------------------

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await findOwnedGoal(session.user.id, id);

    if (!existing) {
      return NextResponse.json({ error: "Goal not found." }, { status: 404 });
    }

    await prisma.financialGoal.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete goal error:", error);

    return NextResponse.json(
      { error: "Failed to delete goal." },
      { status: 500 }
    );
  }
}
