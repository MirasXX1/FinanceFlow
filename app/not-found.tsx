import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Compass className="size-6 text-muted-foreground" aria-hidden />
      </span>

      <div>
        <h1 className="text-lg font-semibold">Page not found.</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
