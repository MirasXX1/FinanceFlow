"use client";

import { useI18n } from "@/components/i18n-provider";

export function HowItWorks() {
  const { t } = useI18n();

  const steps = [
    {
      number: 1,
      title: t.landing.stepCreateAccountTitle,
      text: t.landing.stepCreateAccountText,
    },
    {
      number: 2,
      title: t.landing.stepTransactionsTitle,
      text: t.landing.stepTransactionsText,
    },
    {
      number: 3,
      title: t.landing.stepUnderstandMoneyTitle,
      text: t.landing.stepUnderstandMoneyText,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl px-4 py-16 md:py-24"
    >
      <h2 className="text-center text-3xl font-bold tracking-tight">
        {t.landing.howItWorks}
      </h2>

      <ol className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <li key={step.number} className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
              {step.number}
            </div>

            <h3 className="mt-4 font-semibold">
              {step.title}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}