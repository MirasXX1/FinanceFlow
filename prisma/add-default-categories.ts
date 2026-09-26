import { prisma } from "../lib/prisma";

const DEFAULT_CATEGORIES = [
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

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
    },
  });

  for (const user of users) {
    for (const category of DEFAULT_CATEGORIES) {
      await prisma.category.upsert({
        where: {
          userId_name: {
            userId: user.id,
            name: category.name,
          },
        },
        update: {},
        create: {
          userId: user.id,
          name: category.name,
          icon: category.icon,
        },
      });
    }

    console.log(`Categories added for ${user.email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
