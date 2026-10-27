"use client";

import { useTheme } from "@/hooks/useTheme";
import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { IconMoon, IconSun } from "@/components/ui/icons";
import { cx } from "@/components/ui/primitives";

/**
 * Light/dark switch. Both icons are rendered and CSS shows the right one, so
 * the server markup matches whatever theme the inline script applied before
 * hydration (no icon swap, no hydration mismatch).
 */
export default function ThemeToggler({ locale, className }: { locale: Locale; className?: string }) {
  const { isDark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        isDark
          ? tr(locale, "İşıqlı rejimə keç", "Switch to light mode")
          : tr(locale, "Qaranlıq rejimə keç", "Switch to dark mode")
      }
      className={cx("btn-icon", className)}
    >
      <IconMoon className="dark:hidden" />
      <IconSun className="hidden dark:block" />
    </button>
  );
}
