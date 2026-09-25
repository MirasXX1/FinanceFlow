import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dateToUtcNoon, round2 } from "@/lib/format";
import { transactionCreateSchema } from "@/lib/validations";
import { getTransactions, transactionQuerySchema } from "@/lib/transactions";

// ---------------------------------------------------------------------------
// GET /api/transactions — list with search, filters, sorting and pagination
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = Object.fromEntries(new URL(request.url).searchParams);
    const result = transactionQuerySchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters." },
        { status: 400 }
      );
    }

    const data = await getTransactions(session.user.id, result.data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("List transactions error:", error);

    return NextResponse.json(
      { error: "Failed to load transactions." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/transactions — create an income or expense
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json().catch(() => null);

    const result = transactionCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid transaction data.",
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { type, amount, categoryId, description, date } = result.data;

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId: session.user.id,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found." },
          { status: 400 }
        );
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type,
        amount: round2(amount),
        categoryId: categoryId || null,
        description: description || null,
        date: dateToUtcNoon(date),
      },
      include: {
        category: {
          select: { name: true, icon: true },
        },
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Create transaction error:", error);

    return NextResponse.json(
      { error: "Failed to create transaction." },
      { status: 500 }
    );
  }
}
