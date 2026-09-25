import { ArrowLeftRight, BarChart3, ShieldCheck, Tags, Target, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Wallet, title: "Track your balance", text: "See your total balance, income, and savings update instantly." },
  { icon: ArrowLeftRight, title: "Income & expenses", text: "Add, edit, and remove transactions in seconds." },
  { icon: Tags, title: "Smart categories", text: "Group spending into Food, Transport, Bills, and more." },
  { icon: Target, title: "Financial goals", text: "Save for what matters and watch your progress grow." },
  { icon: BarChart3, title: "Clear statistics", text: "Charts show where your money goes each month." },
  { icon: ShieldCheck, title: "Private & secure", text: "Your data is protected and only visible to you." },
];

export function Features() {
  return (
    <section id="features" className="border-y bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight">Everything you need</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Simple tools that make managing money feel easy.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6 pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
