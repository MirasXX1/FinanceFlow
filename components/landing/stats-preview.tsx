import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Food", width: "75%", color: "bg-emerald-500" },
  { name: "Transport", width: "45%", color: "bg-sky-500" },
  { name: "Shopping", width: "60%", color: "bg-violet-500" },
  { name: "Bills", width: "85%", color: "bg-amber-500" },
];

export function StatsPreview() {
  return (
    <section id="statistics" className="border-y bg-muted/30 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">See where your money goes</h2>
          <p className="mt-4 text-muted-foreground">
            Category breakdowns and monthly trends turn raw transactions into clear insights,
            so you always know what to adjust.
          </p>
        </div>
        <Card aria-hidden="true">
          <CardContent className="space-y-4 p-6 pt-6">
            <p className="text-sm font-medium">Spending by category (illustration)</p>
            {categories.map((category) => (
              <div key={category.name}>
                <p className="mb-1 text-xs text-muted-foreground">{category.name}</p>
                <div className="h-3 rounded-full bg-muted">
                  <div className={`h-3 rounded-full ${category.color}`} style={{ width: category.width }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
