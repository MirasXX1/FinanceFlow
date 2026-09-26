"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Lock, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CURRENCIES, type CurrencyCode } from "@/lib/format";
import { useI18n } from "@/components/i18n-provider";

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

type ProfileFormProps = {
  name: string;
  email: string;
};

export function ProfileForm({
  name: initialName,
  email,
}: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const isDirty = name !== initialName;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      toast.error(t.settings.name);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(
          data?.error || t.settings.profile
        );
        return;
      }

      toast.success(t.settings.saveProfile);
      router.refresh();
    } catch {
      toast.error(t.common.loading);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="settings-name">
          {t.settings.name}
        </Label>

        <Input
          id="settings-name"
          type="text"
          maxLength={100}
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="settings-email"
          className="flex items-center gap-1.5"
        >
          {t.settings.email}
          <Lock
            className="size-3 text-muted-foreground"
            aria-hidden
          />
        </Label>

        <Input
          id="settings-email"
          type="email"
          value={email}
          disabled
          aria-describedby="settings-email-hint"
          className="text-muted-foreground"
        />

        <p
          id="settings-email-hint"
          className="text-xs text-muted-foreground"
        >
          {t.settings.emailDisabled}
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || !isDirty}
          className="gap-2"
        >
          <Save className="size-4" />
          {loading
            ? t.common.loading
            : t.settings.saveProfile}
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Preferences: currency, theme, notifications
// ---------------------------------------------------------------------------

type PreferencesFormProps = {
  currency: CurrencyCode;
  theme: string;
  notificationsEnabled: boolean;
};

export function PreferencesForm({
  currency: initialCurrency,
  theme: dbTheme,
  notificationsEnabled: initialNotifications,
}: PreferencesFormProps) {
  const router = useRouter();
  const { theme: activeTheme, setTheme } = useTheme();
  const { t } = useI18n();

  const [currency, setCurrency] =
    useState<CurrencyCode>(initialCurrency);

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(initialNotifications);

  const [loadingKey, setLoadingKey] =
    useState<string | null>(null);

  async function savePreferences(
    patch: Partial<{
      currency: CurrencyCode;
      theme: string;
      notificationsEnabled: boolean;
    }>,
    key: string
  ) {
    try {
      setLoadingKey(key);

      const response = await fetch(
        "/api/settings/preferences",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patch),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        toast.error(
          data?.error || t.settings.preferences
        );
        return;
      }

      router.refresh();
    } catch {
      toast.error(t.common.loading);
    } finally {
      setLoadingKey(null);
    }
  }

  async function handleCurrencyChange(
    value: string
  ) {
    const next = value as CurrencyCode;

    setCurrency(next);

    await savePreferences(
      { currency: next },
      "currency"
    );

    toast.success(t.settings.currency);
  }

  async function handleThemeChange(value: string) {
    const next = value as
      | "system"
      | "light"
      | "dark";

    setTheme(next);

    await savePreferences(
      { theme: next },
      "theme"
    );

    toast.success(t.settings.theme);
  }

  async function handleNotificationsChange(
    checked: boolean
  ) {
    setNotificationsEnabled(checked);

    await savePreferences(
      {
        notificationsEnabled: checked,
      },
      "notifications"
    );

    toast.success(t.settings.notifications);
  }

  const currentTheme = (
    activeTheme ??
    dbTheme ??
    "system"
  ) as "system" | "light" | "dark";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="settings-currency">
          {t.settings.currency}
        </Label>

        <Select
          value={currency}
          onValueChange={handleCurrencyChange}
        >
          <SelectTrigger
            id="settings-currency"
            className="w-full sm:w-56"
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {CURRENCIES.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
              >
                {item.value} — {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-xs text-muted-foreground">
          {t.settings.currencyDescription}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="settings-theme">
          {t.settings.theme}
        </Label>

        <Select
          value={currentTheme}
          onValueChange={handleThemeChange}
        >
          <SelectTrigger
            id="settings-theme"
            className="w-full sm:w-56"
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="system">
              {t.settings.system}
            </SelectItem>

            <SelectItem value="light">
              {t.settings.light}
            </SelectItem>

            <SelectItem value="dark">
              {t.settings.dark}
            </SelectItem>
          </SelectContent>
        </Select>

        <p className="text-xs text-muted-foreground">
          {t.settings.theme}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
        <div>
          <Label htmlFor="settings-notifications">
            {t.settings.notifications}
          </Label>

          <p className="mt-1 text-xs text-muted-foreground">
            {t.settings.moreNotifications}
          </p>
        </div>

        <Switch
          id="settings-notifications"
          checked={notificationsEnabled}
          onCheckedChange={
            handleNotificationsChange
          }
          disabled={
            loadingKey === "notifications"
          }
          aria-label={t.settings.notifications}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Password
// ---------------------------------------------------------------------------

export function PasswordForm() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [, startTransition] =
    useTransition();

  const { t } = useI18n();

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (newPassword.length < 8) {
      toast.error(
        t.settings.passwordMinLength
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        t.settings.confirmPassword
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/settings/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        toast.error(
          data?.error ||
            t.settings.changePassword
        );
        return;
      }

      toast.success(
        t.settings.changePassword
      );

      startTransition(() => {
        router.refresh();
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error(t.common.loading);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="password-current">
          {t.settings.currentPassword}
        </Label>

        <Input
          id="password-current"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) =>
            setCurrentPassword(
              event.target.value
            )
          }
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password-new">
            {t.settings.newPassword}
          </Label>

          <Input
            id="password-new"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={newPassword}
            onChange={(event) =>
              setNewPassword(
                event.target.value
              )
            }
            required
          />

          <p className="text-xs text-muted-foreground">
            {t.settings.passwordMinLength}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-confirm">
            {t.settings.confirmPassword}
          </Label>

          <Input
            id="password-confirm"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? t.common.loading
            : t.settings.changePassword}
        </Button>
      </div>
    </form>
  );
}