import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 font-semibold"
      aria-label={APP_NAME}
    >
      <Image
        src="/finance.jpeg"
        alt={APP_NAME}
        width={32}
        height={32}
        className="rounded-lg object-cover"
      />

      <span className="text-lg tracking-tight">
        {APP_NAME}
      </span>
    </Link>
  );
}