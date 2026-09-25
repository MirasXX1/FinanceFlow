import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

const previewBars = [40, 65, 50, 80, 60, 90];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-2">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-600">
          {APP_NAME}
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{APP_TAGLINE}</h1>
        <p className="mt-5 max-w-lg text-lg text-muted-foreground">
          Track expenses, manage income, set financial goals, and understand where your money goes.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className={buttonVariants({ size: "lg" })}>
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>
            Login
          </Link>
        </div>
      </div>

      {/* Decorative dashboard preview */}
      <div aria-hidden="true" className="relative">
        <div className="absolute -inset-4 rounded-3xl bg-emerald-500/10 blur-2xl" />
        <Card className="relative shadow-xl">
          <CardContent className="space-y-6 p-6 pt-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Balance", "text-foreground"],
                ["Income", "text-emerald-600"],
                ["Expenses", "text-red-500"],
              ].map(([label, color]) => (
                <div key={label} className="rounded-xl bg-muted p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <div className={`mt-2 h-3 w-16 rounded-full bg-current opacity-30 ${color}`} />
                </div>
              ))}
            </div>
            <div className="flex h-40 items-end gap-3 rounded-xl bg-muted p-4">
              {previewBars.map((height, index) => (
                <div key={index} className="flex h-full flex-1 items-end gap-1">
                  <div className="w-1/2 rounded-t bg-emerald-500" style={{ height: `${height}%` }} />
                  <div className="w-1/2 rounded-t bg-red-400" style={{ height: `${height * 0.6}%` }} />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="h-3 flex-1 rounded-full bg-muted" />
                  <div className="h-3 w-12 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
