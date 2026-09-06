"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { resolveLocale, type Locale } from "@/lib/site";

/**
 * The active locale.
 *
 * The URL segment is authoritative — a direct load of /en/... must render in
 * English even before the Redux store has been synced — with the store as the
 * fallback for routes that sit outside the [lang] segment.
 */
export function useLocale(): { locale: Locale; lang: Locale } {
  const params = useParams();
  const stored = useSelector((s: RootState) => s.locale.value);
  const fromUrl = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;

  const locale: Locale = fromUrl ? resolveLocale(fromUrl) : resolveLocale(stored);
  return { locale, lang: locale };
}
