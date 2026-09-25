import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dateToUtcNoon, round2 } from "@/lib/format";
import { transactionUpdateSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Finds a transaction owned by the authenticated user, or returns null.
 * Scoping every lookup by `userId` prevents IDOR.
 */
async function findOwnedTransaction(userId: string, id: string) {
  if (!id || id.length > 40) {
    return null;
  }

  return prisma.transaction.findFirst({
    where: {
      id,
      userId,
    },
  });
}

// ---------------------------------------------------------------------------
// PATCH /api/transactions/[id] — update an owned transaction
// ---------------------------------------------------------------------------

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await findOwnedTransaction(session.user.id, id);

    if (!existing) {
      return NextResponse.json(
        { error: "Transaction not found." },
        { status: 404 }
      );
    }

    const body: unknown = await request.json().catch(() => null);

    const result = transactionUpdateSchema.safeParse(body);

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

    const transaction = await prisma.transaction.update({
      where: { id: existing.id },
      data: {
        ...(type !== undefined && { type }),
        ...(amount !== undefined && { amount: round2(amount) }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(description !== undefined && { description: description || null }),
        ...(date !== undefined && { date: dateToUtcNoon(date) }),
      },
      include: {
        category: {
          select: { name: true, icon: true },
        },
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Update transaction error:", error);

    return NextResponse.json(
      { error: "Failed to update transaction." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/transactions/[id] — delete an owned transaction
// ---------------------------------------------------------------------------

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await findOwnedTransaction(session.user.id, id);

    if (!existing) {
      return NextResponse.json(
        { error: "Transaction not found." },
        { status: 404 }
      );
    }

    await prisma.transaction.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete transaction error:", error);

    return NextResponse.json(
      { error: "Failed to delete transaction." },
      { status: 500 }
    );
  }
}
