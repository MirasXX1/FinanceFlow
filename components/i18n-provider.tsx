"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { en } from "@/lib/i18n/en";
import { ru } from "@/lib/i18n/ru";
import { kk } from "@/lib/i18n/kk";
import type { Locale } from "@/lib/i18n/types";

const STORAGE_KEY = "financeflow-locale";

const translations = {
  en,
  ru,
  kk,
};

type Translations = {
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    loading: string;
    noData: string;
    back: string;
    confirm: string;
    close: string;
    reset: string;
    previous: string;
    next: string;
    all: string;
  };

  nav: {
    dashboard: string;
    transactions: string;
    goals: string;
    statistics: string;
    settings: string;
    logout: string;
  };

  dashboard: {
    title: string;
    subtitle: string;
    balance: string;
    income: string;
    expenses: string;
    savings: string;
    recentTransactions: string;
    incomeVsExpenses: string;
    incomeVsExpensesDescription: string;
    expenseCategories: string;
    expenseCategoriesDescription: string;
    noTransactions: string;
    transaction: string;
    addIncome: string;
    addExpense: string;
    viewAll: string;
  };

  transactions: {
    title: string;
    subtitle: string;
    addTransaction: string;
    editTransaction: string;
    deleteTransaction: string;
    type: string;
    income: string;
    expense: string;
    amount: string;
    description: string;
    category: string;
    date: string;
    actions: string;
    all: string;
    noTransactions: string;
    noMatchingTransactions: string;
    searchPlaceholder: string;
    allTypes: string;
    allCategories: string;
    noCategory: string;
    newestFirst: string;
    oldestFirst: string;
    highestAmount: string;
    lowestAmount: string;
    fromDate: string;
    toDate: string;
    resetFilters: string;
    showing: string;
    of: string;
    page: string;
  };

  categories: {
    food: string;
    transport: string;
    entertainment: string;
    education: string;
    shopping: string;
    health: string;
    bills: string;
    travel: string;
    other: string;
  };

  goals: {
    title: string;
    subtitle: string;
    totalGoals: string;
    completed: string;
    totalTarget: string;
    totalSaved: string;
    addGoal: string;
    editGoal: string;
    deleteGoal: string;
    goalName: string;
    targetAmount: string;
    currentAmount: string;
    deadline: string;
    deadlineOptional: string;
    color: string;
    progress: string;
    noGoals: string;
    noDeadline: string;
    deleteConfirm: string;
  };

  statistics: {
    title: string;
    subtitle: string;
    income: string;
    expenses: string;
    netBalance: string;
    avgMonthlyExpenses: string;
    monthlyAnalysis: string;
    monthlyAnalysisDescription: string;
    topCategories: string;
    topCategoriesDescription: string;
    expenseCategories: string;
    expenseCategoriesDescription: string;
    spendingTrend: string;
    spendingTrendDescription: string;
    insights: string;
    insightsDescription: string;
    noExpenseData: string;
    largestCategory: string;
    youSpent: string;
    incomeThisMonth: string;
    expensesThisMonth: string;
    youKept: string;
    youOverspentBy: string;
    thisMonth: string;
    more: string;
    less: string;
    thanLastMonth: string;
    savingsRate: string;
    ofTotalIncome: string;
  };

  settings: {
    title: string;
    subtitle: string;
    profile: string;
    profileDescription: string;
    preferences: string;
    preferencesDescription: string;
    security: string;
    securityDescription: string;
    name: string;
    email: string;
    emailDisabled: string;
    currency: string;
    currencyDescription: string;
    theme: string;
    notifications: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    passwordMinLength: string;
    saveProfile: string;
    system: string;
    light: string;
    dark: string;
    moreNotifications: string;
  };

  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    noAccount: string;
    haveAccount: string;
  };

  charts: {
    noData: string;
    noExpenseTrend: string;
    noExpenses: string;
    totalSpent: string;
    income: string;
    expenses: string;
  };

  landing: {
    title: string;
    subtitle: string;
    getStarted: string;
    learnMore: string;
    features: string;
    howItWorks: string;
    statistics: string;
    seeWhereMoneyGoes: string;
    spendingByCategory: string;
    readyToTakeControl: string;
    login: string;
  };
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === "en" || saved === "ru" || saved === "kk") {
      setLocaleState(saved);
    }
  }, []);

  function setLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }

  const value: I18nContextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t: translations[locale],
    }),
    [locale],
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}