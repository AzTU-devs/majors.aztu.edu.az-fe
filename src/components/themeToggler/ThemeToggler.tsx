"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useLocale } from "@/hooks/useLocale";
import { tr } from "@/lib/i18n";

export default function ThemeToggler() {
  const { isDark, toggle } = useTheme();
  const { locale } = useLocale();

  // The server cannot know the visitor's stored theme, so the icon is only
  // rendered after mount. Without this the markup mismatches on hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        isDark
          ? tr(locale, "İşıqlı rejimə keç", "Switch to light mode")
          : tr(locale, "Qaranlıq rejimə keç", "Switch to dark mode")
      }
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--text-body)] transition-all duration-200 hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] active:scale-90"
    >
      {!mounted ? (
        <span aria-hidden className="h-[18px] w-[18px]" />
      ) : isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-[18px] w-[18px] text-amber-300">
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 3v1.5M12 19.5V21M21 12h-1.5M4.5 12H3m14.36-6.36l-1.06 1.06M7.7 16.3l-1.06 1.06m10.72 0l-1.06-1.06M7.7 7.7L6.64 6.64"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-[18px] w-[18px]">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
