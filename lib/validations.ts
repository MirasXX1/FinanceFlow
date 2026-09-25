import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/** `YYYY-MM-DD` */
const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Please provide a valid date.");

const categoryId = z
  .string()
  .trim()
  .min(1)
  .max(40)
  .nullable()
  .optional()
  .transform((value) => (value ? value : undefined));

const description = z
  .string()
  .trim()
  .max(500, "Description must be at most 500 characters.")
  .nullable()
  .optional()
  .transform((value) => (value ? value : undefined));

const amount = z
  .number({ message: "Amount must be a number." })
  .positive("Amount must be greater than 0.")
  .max(999_999_999_999, "Amount is too large.");

const transactionType = z.enum(["INCOME", "EXPENSE"], {
  message: "Type must be either INCOME or EXPENSE.",
});

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

export const transactionCreateSchema = z.object({
  type: transactionType,
  amount,
  categoryId,
  description,
  date: dateString,
});

export const transactionUpdateSchema = transactionCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

export type TransactionCreateInput = z.infer<typeof transactionCreateSchema>;
export type TransactionUpdateInput = z.infer<typeof transactionUpdateSchema>;

// ---------------------------------------------------------------------------
// Financial goals
// ---------------------------------------------------------------------------

const goalName = z
  .string()
  .trim()
  .min(1, "Goal name is required.")
  .max(100, "Goal name must be at most 100 characters.");

const goalColor = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex value.")
  .nullable()
  .optional()
  .transform((value) => (value ? value.toLowerCase() : undefined));

export const goalCreateSchema = z.object({
  name: goalName,
  targetAmount: amount,
  currentAmount: z
    .number({ message: "Current amount must be a number." })
    .min(0, "Current amount cannot be negative.")
    .max(999_999_999_999, "Amount is too large."),
  deadline: dateString.nullable().optional(),
  color: goalColor,
});

export const goalUpdateSchema = z.object({
  name: goalName.optional(),
  targetAmount: amount.optional(),
  currentAmount: z
    .number()
    .min(0, "Current amount cannot be negative.")
    .max(999_999_999_999, "Amount is too large.")
    .optional(),
  deadline: dateString.nullable().optional(),
  color: goalColor,
});

export type GoalCreateInput = z.infer<typeof goalCreateSchema>;
export type GoalUpdateInput = z.infer<typeof goalUpdateSchema>;

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty.")
    .max(100, "Name must be at most 100 characters."),
});

export const preferencesUpdateSchema = z.object({
  currency: z.enum(["KZT", "USD", "EUR"]),
  theme: z.enum(["system", "light", "dark"]).optional(),
  notificationsEnabled: z.boolean().optional(),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(100, "New password must be at most 100 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
