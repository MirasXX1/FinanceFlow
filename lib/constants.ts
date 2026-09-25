import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  Settings,
  Target,
  type LucideIcon,
} from "lucide-react";

export const APP_NAME = "FinanceFlow";
export const APP_TAGLINE = "Take control of your money.";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Statistics", href: "/statistics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];
