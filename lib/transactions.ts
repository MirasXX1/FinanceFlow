import { Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { dateToUtcNoon } from "@/lib/format";

/**
 * Query params accepted by the transactions page and the GET API.
 * All params are optional and default to a sensible listing.
 */
export const transactionQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .max(100)
    .optional()
    .default(""),
  type: z
    .enum(["INCOME", "EXPENSE", "ALL"])
    .optional()
    .default("ALL"),
  category: z
    .string()
    .trim()
    .max(40)
    .optional()
    .default(""),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date.")
    .or(z.literal(""))
    .optional()
    .default(""),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date.")
    .or(z.literal(""))
    .optional()
    .default(""),
  sort: z
    .enum(["newest", "oldest", "highest", "lowest"])
    .optional()
    .default("newest"),
  page: z.coerce
    .number()
    .int()
    .min(1)
    .optional()
    .default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .default(10),
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;

export const TRANSACTION_PAGE_SIZES = [10, 25, 50];

/**
 * Builds the Prisma `where` clause. Always scoped to the authenticated user.
 */
function buildWhere(userId: string, query: TransactionQuery): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = {
    userId,
  };

  if (query.q) {
    where.OR = [
      { description: { contains: query.q, mode: "insensitive" } },
      { category: { name: { contains: query.q, mode: "insensitive" } } },
    ];
  }

  if (query.type !== "ALL") {
    where.type = query.type;
  }

  if (query.category) {
    where.categoryId = query.category;
  }

  const dateFilter: Prisma.DateTimeFilter = {};

  if (query.from) {
    dateFilter.gte = dateToUtcNoon(query.from);
  }

  if (query.to) {
    dateFilter.lte = new Date(`${query.to}T23:59:59.999Z`);
  }

  if (query.from || query.to) {
    where.date = dateFilter;
  }

  return where;
}

function buildOrderBy(sort: TransactionQuery["sort"]): Prisma.TransactionOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ date: "asc" }, { createdAt: "asc" }];
    case "highest":
      return [{ amount: "desc" }, { date: "desc" }];
    case "lowest":
      return [{ amount: "asc" }, { date: "desc" }];
    case "newest":
    default:
      return [{ date: "desc" }, { createdAt: "desc" }];
  }
}

/**
 * Paginated, filtered, sorted transaction list for a single user.
 */
export async function getTransactions(userId: string, query: TransactionQuery) {
  const where = buildWhere(userId, query);

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
            icon: true,
          },
        },
      },
      orderBy: buildOrderBy(query.sort),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));

  return {
    transactions,
    total,
    page: query.page,
    pageSize: query.pageSize,
    totalPages,
  };
}
