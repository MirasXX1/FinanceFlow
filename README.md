# FinanceFlow

**Take control of your money.**

FinanceFlow is a full-stack personal finance management web application for tracking income and expenses, managing savings goals, and understanding spending through interactive statistics and charts.

Built with **Next.js, TypeScript, PostgreSQL, Prisma, Auth.js, Tailwind CSS, and Recharts** and deployed with **Vercel + Neon**.

## 🌐 Live Demo

**Production:**
https://finance-flow-lovat-ten.vercel.app

## ✨ Features

### 🔐 Authentication

* Email/password registration and login
* Secure password hashing with bcrypt
* Auth.js / NextAuth authentication
* JWT sessions
* Protected application routes
* Secure user-specific data access

### 💰 Dashboard

* Current balance
* Total income
* Total expenses
* Savings
* Monthly income vs. expenses chart
* Spending by category
* Recent transactions
* Quick income and expense actions

### 💳 Transactions

* Create transactions
* Edit transactions
* Delete transactions
* Income and expense types
* Categories
* Search
* Filtering by type, category, and date
* Sorting
* Pagination
* Zod validation

### 🎯 Financial Goals

* Create savings goals
* Set target amounts
* Track progress
* Set deadlines
* Edit and delete goals
* Per-goal statistics

### 📊 Statistics

* Monthly financial analysis
* Income and expense trends
* Spending by category
* Top spending categories
* Financial insights based on user data

### ⚙️ Settings

* Update profile name
* Change currency
* Light / dark / system theme
* Notification preferences
* Change password

### 🌍 Internationalization

* 🇬🇧 English
* 🇷🇺 Russian
* 🇰🇿 Kazakh

### 📱 Responsive UI

* Desktop layout
* Mobile navigation
* Responsive dashboard
* Dark mode
* Loading states
* Empty states
* Confirmation dialogs
* Toast notifications

## 🛠 Tech Stack

| Layer            | Technology             |
| ---------------- | ---------------------- |
| Framework        | Next.js 16, App Router |
| Language         | TypeScript             |
| Frontend         | React 19               |
| Styling          | Tailwind CSS v4        |
| UI Components    | shadcn/ui              |
| Icons            | Lucide React           |
| Charts           | Recharts               |
| Database         | PostgreSQL             |
| Database Hosting | Neon                   |
| ORM              | Prisma                 |
| Authentication   | Auth.js / NextAuth v5  |
| Password Hashing | bcrypt                 |
| Validation       | Zod                    |
| Deployment       | Vercel                 |

## 🏗 Architecture

```text
┌─────────────────────┐
│       Browser       │
│   React / Next.js   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       Vercel        │
│    Next.js App      │
│                     │
│  Server Components  │
│  API Routes         │
│  Authentication     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       Prisma        │
│         ORM         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│        Neon         │
│     PostgreSQL      │
└─────────────────────┘
```

## 📁 Project Structure

```text
financeflow/
├── app/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── goals/
│   │   ├── settings/
│   │   ├── statistics/
│   │   └── transactions/
│   ├── api/
│   │   ├── auth/
│   │   ├── goals/
│   │   ├── register/
│   │   ├── settings/
│   │   └── transactions/
│   ├── login/
│   ├── register/
│   └── page.tsx
│
├── components/
│   ├── charts/
│   ├── goals/
│   ├── layout/
│   ├── settings/
│   ├── transactions/
│   └── ui/
│
├── lib/
│   ├── i18n/
│   ├── auth.ts
│   ├── prisma.ts
│   └── types.ts
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
├── auth.ts
├── proxy.ts
├── prisma.config.ts
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have:

* Node.js 20+
* npm
* PostgreSQL database
* Git

You can use a free PostgreSQL database from [Neon](https://neon.tech).

### 2. Clone the repository

```bash
git clone https://github.com/MirasXX1/FinanceFlow.git
cd FinanceFlow
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a local `.env` file:

```bash
cp .env.example .env
```

Configure the required variables:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret"
SEED_USER_EMAIL="demo@financeflow.app"
SEED_USER_PASSWORD="demo12345"
```

> Never commit `.env` to GitHub.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Apply database migrations

```bash
npm run db:migrate:deploy
```

### 7. Seed demo data

```bash
npm run db:seed
```

The seed creates a demo user, default categories, sample transactions, and financial goals.

### 8. Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 🧪 Useful Commands

| Command                     | Description                      |
| --------------------------- | -------------------------------- |
| `npm run dev`               | Start development server         |
| `npm run build`             | Build the production application |
| `npm start`                 | Start the production server      |
| `npm run lint`              | Run ESLint                       |
| `npx tsc --noEmit`          | Check TypeScript                 |
| `npm run db:migrate:deploy` | Apply Prisma migrations          |
| `npm run db:seed`           | Seed demo data                   |
| `npm run db:studio`         | Open Prisma Studio               |

## ☁️ Deployment

FinanceFlow is deployed using:

* **Vercel** — Next.js hosting
* **Neon** — PostgreSQL database
* **GitHub** — source code and version control

Production deployment:

**https://finance-flow-lovat-ten.vercel.app**

Every push to the `main` branch can trigger a new Vercel deployment.

### Production Environment Variables

The following environment variables are required:

| Variable       | Description                       |
| -------------- | --------------------------------- |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET`  | Secret used by Auth.js            |

> Production secrets must never be committed to GitHub.

## 🔒 Security

FinanceFlow includes several security measures:

* Passwords are hashed with bcrypt.
* Protected routes require authentication.
* API routes validate the authenticated user.
* Database queries are scoped by `userId`.
* Users cannot access another user's transactions or financial goals.
* Input is validated using Zod.
* Sensitive environment variables are stored outside the repository.
* `.env` is excluded from Git using `.gitignore`.

## 🗄️ Database

FinanceFlow uses PostgreSQL with Prisma.

Main models include:

```text
User
 ├── Account
 ├── Session
 ├── Category
 ├── Transaction
 └── FinancialGoal
```

Transactions support:

```text
INCOME
EXPENSE
```

Supported currencies:

```text
KZT
USD
EUR
```

Default transaction categories:

```text
Food
Transport
Entertainment
Education
Shopping
Health
Bills
Travel
Other
```

## 🌍 Localization

The application supports three languages:

```text
English
Русский
Қазақша
```

The selected language is stored locally in the browser and can be changed from the application interface.

## 🎯 Project Goals

FinanceFlow was created as a full-stack portfolio project to practice:

* Next.js
* React
* TypeScript
* REST API development
* Authentication
* PostgreSQL
* Prisma ORM
* Database design
* Form validation
* Data visualization
* Responsive UI
* Internationalization
* Git/GitHub
* Production deployment

## 📸 Screenshots

Screenshots of the application can be added here:

```text
Landing Page
Dashboard
Transactions
Goals
Statistics
Settings
```

## 👨‍💻 Author

**Miras**

GitHub:
https://github.com/MirasXX1

## 📄 License

This project is licensed under the MIT License.
