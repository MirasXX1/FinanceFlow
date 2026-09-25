const steps = [
  { title: "Create your account", text: "Sign up for free in under a minute." },
  { title: "Add your transactions", text: "Record income and expenses as they happen." },
  { title: "Understand your money", text: "Use charts and goals to make better decisions." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <h2 className="text-center text-3xl font-bold tracking-tight">How it works</h2>
      <ol className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
              {index + 1}
            </div>
            <h3 className="mt-4 font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
