import { PrismaClient, TransactionType, Currency } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting FinanceFlow seed...");

  const email = process.env.SEED_USER_EMAIL ?? "demo@financeflow.app";
  const password = process.env.SEED_USER_PASSWORD ?? "demo12345";

  const passwordHash = await bcrypt.hash(password, 10);

  // --------------------------------------------------
  // Demo user
  // --------------------------------------------------

  const user = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      passwordHash,
      name: "Demo User",
      currency: Currency.KZT,
      theme: "system",
      notificationsEnabled: true,
    },
    create: {
      email,
      passwordHash,
      name: "Demo User",
      currency: Currency.KZT,
      theme: "system",
      notificationsEnabled: true,
    },
  });

  console.log(`👤 Demo user: ${user.email}`);

  // --------------------------------------------------
  // Categories
  // --------------------------------------------------

  const categoryData = [
    { name: "Food", icon: "utensils" },
    { name: "Transport", icon: "car" },
    { name: "Entertainment", icon: "gamepad-2" },
    { name: "Education", icon: "book-open" },
    { name: "Shopping", icon: "shopping-bag" },
    { name: "Health", icon: "heart-pulse" },
    { name: "Bills", icon: "receipt" },
    { name: "Travel", icon: "plane" },
    { name: "Other", icon: "ellipsis" },
  ];

  const categories = new Map<string, string>();

  for (const category of categoryData) {
    const created = await prisma.category.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: category.name,
        },
      },
      update: {
        icon: category.icon,
      },
      create: {
        userId: user.id,
        name: category.name,
        icon: category.icon,
      },
    });

    categories.set(created.name, created.id);
  }

  console.log(`📂 Categories: ${categories.size}`);

  // --------------------------------------------------
  // Clear existing demo transactions and goals
  // --------------------------------------------------

  await prisma.transaction.deleteMany({
    where: {
      userId: user.id,
    },
  });

  await prisma.financialGoal.deleteMany({
    where: {
      userId: user.id,
    },
  });

  // --------------------------------------------------
  // Helper
  // --------------------------------------------------

  function categoryId(name: string) {
    const id = categories.get(name);

    if (!id) {
      throw new Error(`Category not found: ${name}`);
    }

    return id;
  }

  // --------------------------------------------------
  // Transactions
  // --------------------------------------------------

  const transactions = [
    {
      type: TransactionType.INCOME,
      amount: 450000,
      description: "Monthly salary",
      category: "Other",
      date: "2026-04-01",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 85000,
      description: "Apartment rent",
      category: "Bills",
      date: "2026-04-02",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 12500,
      description: "Groceries",
      category: "Food",
      date: "2026-04-04",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 4500,
      description: "Taxi",
      category: "Transport",
      date: "2026-04-06",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 15000,
      description: "Gym membership",
      category: "Health",
      date: "2026-04-08",
    },

    {
      type: TransactionType.INCOME,
      amount: 450000,
      description: "Monthly salary",
      category: "Other",
      date: "2026-05-01",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 85000,
      description: "Apartment rent",
      category: "Bills",
      date: "2026-05-02",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 18000,
      description: "Groceries",
      category: "Food",
      date: "2026-05-04",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 7500,
      description: "Public transport",
      category: "Transport",
      date: "2026-05-06",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 22000,
      description: "New clothes",
      category: "Shopping",
      date: "2026-05-10",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 8000,
      description: "Cinema and games",
      category: "Entertainment",
      date: "2026-05-15",
    },

    {
      type: TransactionType.INCOME,
      amount: 480000,
      description: "Monthly salary",
      category: "Other",
      date: "2026-06-01",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 85000,
      description: "Apartment rent",
      category: "Bills",
      date: "2026-06-02",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 21000,
      description: "Groceries",
      category: "Food",
      date: "2026-06-05",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 9500,
      description: "Taxi and bus",
      category: "Transport",
      date: "2026-06-08",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 35000,
      description: "Online course",
      category: "Education",
      date: "2026-06-12",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 12000,
      description: "Restaurant",
      category: "Food",
      date: "2026-06-18",
    },

    {
      type: TransactionType.INCOME,
      amount: 480000,
      description: "Monthly salary",
      category: "Other",
      date: "2026-07-01",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 85000,
      description: "Apartment rent",
      category: "Bills",
      date: "2026-07-02",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 24000,
      description: "Groceries",
      category: "Food",
      date: "2026-07-05",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 11000,
      description: "Transport",
      category: "Transport",
      date: "2026-07-08",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 28000,
      description: "Clothes",
      category: "Shopping",
      date: "2026-07-14",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 18000,
      description: "Entertainment",
      category: "Entertainment",
      date: "2026-07-20",
    },

    {
      type: TransactionType.INCOME,
      amount: 500000,
      description: "Monthly salary",
      category: "Other",
      date: "2026-08-01",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 85000,
      description: "Apartment rent",
      category: "Bills",
      date: "2026-08-02",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 27000,
      description: "Groceries",
      category: "Food",
      date: "2026-08-05",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 12500,
      description: "Transport",
      category: "Transport",
      date: "2026-08-08",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 15000,
      description: "Books",
      category: "Education",
      date: "2026-08-12",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 25000,
      description: "Weekend trip",
      category: "Travel",
      date: "2026-08-20",
    },

    {
      type: TransactionType.INCOME,
      amount: 500000,
      description: "Monthly salary",
      category: "Other",
      date: "2026-09-01",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 85000,
      description: "Apartment rent",
      category: "Bills",
      date: "2026-09-02",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 30000,
      description: "Groceries",
      category: "Food",
      date: "2026-09-05",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 14000,
      description: "Transport",
      category: "Transport",
      date: "2026-09-08",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 20000,
      description: "Entertainment",
      category: "Entertainment",
      date: "2026-09-12",
    },
    {
      type: TransactionType.EXPENSE,
      amount: 18000,
      description: "Shopping",
      category: "Shopping",
      date: "2026-09-15",
    },
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: {
        userId: user.id,
        categoryId: categoryId(transaction.category),
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: new Date(`${transaction.date}T12:00:00`),
      },
    });
  }

  console.log(`💳 Transactions: ${transactions.length}`);

  // --------------------------------------------------
  // Financial goals
  // --------------------------------------------------

  const goals = [
    {
      name: "MacBook Pro",
      targetAmount: 900000,
      currentAmount: 420000,
      deadline: "2027-03-01",
      color: "blue",
    },
    {
      name: "Travel Fund",
      targetAmount: 500000,
      currentAmount: 185000,
      deadline: "2027-06-01",
      color: "green",
    },
    {
      name: "Emergency Fund",
      targetAmount: 1000000,
      currentAmount: 350000,
      deadline: "2027-12-31",
      color: "orange",
    },
  ];

  for (const goal of goals) {
    await prisma.financialGoal.create({
      data: {
        userId: user.id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: new Date(`${goal.deadline}T12:00:00`),
        color: goal.color,
      },
    });
  }

  console.log(`🎯 Financial goals: ${goals.length}`);
  console.log("");
  console.log("✅ FinanceFlow seed completed successfully!");
  console.log(`📧 Demo email: ${email}`);
  console.log(`🔑 Demo password: ${password}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });