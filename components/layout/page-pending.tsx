import { Card, CardContent } from "@/components/ui/card";

export function PagePending({ phase, feature }: { phase: number; feature: string }) {
  return (
    <Card>
      <CardContent className="py-16 text-center text-sm text-muted-foreground">
        {feature} will be built in Phase {phase}.
      </CardContent>
    </Card>
  );
}
