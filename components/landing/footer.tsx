import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <p>{APP_TAGLINE}</p>
      </div>
    </footer>
  );
}
