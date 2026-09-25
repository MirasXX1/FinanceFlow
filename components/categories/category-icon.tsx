import {
  BookOpen,
  Car,
  Ellipsis,
  Gamepad2,
  HeartPulse,
  Plane,
  Receipt,
  ShoppingBag,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Maps the icon identifier stored in `Category.icon` to a Lucide icon.
 */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  car: Car,
  "gamepad-2": Gamepad2,
  "book-open": BookOpen,
  "shopping-bag": ShoppingBag,
  "heart-pulse": HeartPulse,
  receipt: Receipt,
  plane: Plane,
  ellipsis: Ellipsis,
};

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string | null | undefined;
  className?: string;
}) {
  const Icon = (icon && CATEGORY_ICONS[icon]) || Ellipsis;

  return <Icon aria-hidden className={cn("size-4", className)} />;
}
