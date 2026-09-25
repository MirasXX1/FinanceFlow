import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dateToUtcNoon, round2 } from "@/lib/format";
import { goalCreateSchema } from "@/lib/validations";

// ---------------------------------------------------------------------------
// GET /api/goals — list the authenticated user's goals
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await prisma.financialGoal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("List goals error:", error);

    return NextResponse.json(
      { error: "Failed to load goals." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/goals — create a goal
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json().catch(() => null);

    const result = goalCreateSchema.safeParse(body);

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

    const goal = await prisma.financialGoal.create({
      data: {
        userId: session.user.id,
        name,
        targetAmount: round2(targetAmount),
        currentAmount: round2(currentAmount),
        deadline: deadline ? dateToUtcNoon(deadline) : null,
        color: color || null,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Create goal error:", error);

    return NextResponse.json(
      { error: "Failed to create goal." },
      { status: 500 }
    );
  }
}
