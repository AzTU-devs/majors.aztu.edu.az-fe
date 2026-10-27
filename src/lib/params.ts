import { notFound } from "next/navigation";

import { isLocale, type Locale } from "./site";

/**
 * The `[lang]` segment of a page's URL. Anything but a supported locale is a
 * 404: the segment used to fall back to Azerbaijani, so /api/programmes,
 * /assets/programmes/... and /ads.txt rendered real pages (with status 200).
 */
export function localeParam(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}
