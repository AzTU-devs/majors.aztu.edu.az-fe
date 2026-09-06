"use client";

import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setLocale } from "@/redux/slices/localeSlice";
import { useLocale } from "@/hooks/useLocale";
import { LOCALES, HTML_LANG, type Locale } from "@/lib/site";
import { cx } from "../ui/primitives";

export default function LanguageToggler() {
  const dispatch = useDispatch<AppDispatch>();
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    dispatch(setLocale(next));

    // Swap the leading [lang] segment, keeping the rest of the path so the
    // visitor stays on the same page in the other language.
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length && LOCALES.includes(segments[0] as Locale)) {
      segments[0] = next;
    } else {
      segments.unshift(next);
    }
    router.push("/" + segments.join("/"));
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center rounded-full border border-[var(--border-strong)] p-0.5"
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          lang={HTML_LANG[l]}
          aria-pressed={locale === l}
          className={cx(
            "rounded-full px-3 py-1 text-[12px] font-bold uppercase transition-all duration-200",
            locale === l
              ? "bg-[var(--brand)] text-white shadow-sm dark:text-[#0a0f2b]"
              : "text-[var(--text-muted)] hover:text-[var(--text-strong)]"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
