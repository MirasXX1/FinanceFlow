# FinanceFlow

**Take control of your money.**

A full-stack personal finance web application: track income and expenses, set
savings goals, and understand where your money goes with real charts and
statistics — backed by a real PostgreSQL database.

## Features

- **Authentication** — email/password sign-up and sign-in (Auth.js v5, bcrypt,
  JWT sessions), protected routes via `proxy.ts`
- **Dashboard** — balance, income, expenses, savings, income-vs-expenses chart,
  expense category donut, recent transactions, quick add income/expense
- **Transactions** — full CRUD with Zod validation, search, type/category/date
  filters, sorting, DB-level pagination, edit/delete dialogs
- **Goals** — savings targets with progress bars, deadlines, color accents and
  per-goal statistics
- **Statistics** — monthly analysis, spending trends, top categories and factual
  insights generated from your data
- **Settings** — profile name, currency (KZT / USD / EUR), theme
  (system / light / dark), notifications, password change
- **Responsive SaaS UI** — light/dark mode, mobile navigation, loading
  skeletons, empty states, toasts and confirmation dialogs

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS v4, shadcn/ui components, Lucide icons, Recharts, Sonner |
| Database | PostgreSQL (Neon in production), Prisma ORM (driver adapters + queryCompiler) |
| Auth | Auth.js / NextAuth v5 (credentials provider, JWT sessions) |
| Validation | Zod |
| Deployment | Vercel |

## Getting started

### 1. Prerequisites

- Node.js 20+
- A PostgreSQL database (local or a free [Neon](https://neon.tech) project)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="$(openssl rand -base64 32)"
SEED_USER_EMAIL="demo@financeflow.app"
SEED_USER_PASSWORD="demo12345"
```

> `.env` is git-ignored and must never be committed.

### 4. Apply migrations and seed demo data

```bash
npm run db:migrate:deploy   # apply Prisma migrations
npm run db:seed             # seed demo user + sample data
```

Demo account: `demo@financeflow.app` / `demo12345`

### 5. Run

```bash
npm run dev    # development
npm run build  # production build
npm start      # production server
```

## Deployment (Vercel + Neon)

1. Push the repository to GitHub.
2. Create a PostgreSQL database on [Neon](https://neon.tech) and copy the
   **pooled** connection string.
3. Import the project on [Vercel](https://vercel.com) and set the environment
   variables:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | Neon pooled connection string (`?sslmode=require`) |
   | `AUTH_SECRET` | A fresh `openssl rand -base64 32` value (not the dev one) |

4. Apply migrations to the production database from your machine (or CI):

   ```bash
   DATABASE_URL="<production-url>" npx prisma migrate deploy
   ```

   > Never run `prisma migrate reset` against production.

5. Deploy. Every push to `main` will trigger a new deployment.

## Useful scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Generate the Prisma client and build |
| `npm run lint` | ESLint |
| `npm run db:migrate:deploy` | Apply migrations (safe for production) |
| `npm run db:seed` | Seed the demo user and data |
| `npm run db:studio` | Open Prisma Studio |

## Security notes

- Every private API route authenticates the session and scopes all Prisma
  queries by `userId` — users can never read or modify another user's data.
- All mutations are validated with Zod before touching the database.
- Passwords are hashed with bcrypt; error messages never leak internals.
- Secrets live only in environment variables (`.env` is git-ignored).

## License

MIT
