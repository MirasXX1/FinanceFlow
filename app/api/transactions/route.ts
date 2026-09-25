import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().positive(),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  date: z.string(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const result = transactionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid transaction data." },
        { status: 400 }
      );
    }

    const {
      type,
      amount,
      categoryId,
      description,
      date,
    } = result.data;

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
        amount,
        categoryId: categoryId || null,
        description: description || null,
        date: new Date(date),
      },
      include: {
        category: true,
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
