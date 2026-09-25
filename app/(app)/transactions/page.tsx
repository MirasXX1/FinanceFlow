import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getTransactions, transactionQuerySchema } from "@/lib/transactions";
import type { CurrencyCode } from "@/lib/format";
import type { TransactionType } from "@/lib/types";

import { PageHeader } from "@/components/layout/page-header";
import { TransactionsView } from "@/components/transactions/transactions-view";

export const metadata = { title: "Transactions" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sessionUser = await requireAuth();

  const params = await searchParams;
  const query = transactionQuerySchema.safeParse(params);
  const parsedQuery = query.success
    ? query.data
    : transactionQuerySchema.parse({});

  const [user, categories, hasAnyTransaction, list] = await Promise.all([
    prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { currency: true },
    }),
    prisma.category.findMany({
      where: { userId: sessionUser.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true, icon: true },
    }),
    prisma.transaction.count({ where: { userId: sessionUser.id } }),
    getTransactions(sessionUser.id, parsedQuery),
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  const transactions = list.transactions.map((transaction) => ({
    id: transaction.id,
    type: transaction.type as TransactionType,
    amount: Number(transaction.amount),
    description: transaction.description,
    date: transaction.date.toISOString(),
    categoryId: transaction.categoryId,
    categoryName: transaction.category?.name ?? null,
    categoryIcon: transaction.category?.icon ?? null,
  }));

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Search, filter, and manage your transactions."
      />

      <TransactionsView
        transactions={transactions}
        categories={categories}
        currency={user.currency as CurrencyCode}
        page={list.page}
        pageSize={list.pageSize}
        total={list.total}
        totalPages={list.totalPages}
        hasTransactions={hasAnyTransaction > 0}
      />
    </>
  );
}
