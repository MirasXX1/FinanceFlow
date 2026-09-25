import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

// Load .env for CLI commands (prisma config files do not load it automatically).
try {
  process.loadEnvFile();
} catch {
  // .env is optional (e.g. on Vercel the variables come from the platform)
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  experimental: {
    adapter: true,
  },
  engine: "js",
  adapter: async () => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }

    return new PrismaPg({ connectionString });
  },
});
