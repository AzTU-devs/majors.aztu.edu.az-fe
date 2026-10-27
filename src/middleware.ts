// middleware.ts (in src/ because this project uses the src directory)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { NONCE_HEADER, contentSecurityPolicy, newNonce } from "@/lib/csp";
import { DEFAULT_LOCALE, isLocale } from "@/lib/site";

/** Header the root layout reads to render the correct `<html lang>`. */
const LANG_HEADER = "x-aztu-lang";

/*
  Requests for files, not pages, pass through unchanged (they only get the
  CSP header, below). Next.js then serves
  the file — from public/ (any folder), or an app metadata route (favicon,
  icons, manifest, robots.txt, sitemap.xml) — and answers 404 when there is
  none: the [lang] segment accepts only "az" and "en" (src/lib/params.ts).
  Previously a top-level name with an extension (/ads.txt, /x.png) rendered
  the home page with status 200, and /brand/aztu-mark.png was redirected to
  /az/brand/aztu-mark.png and 404'd.

    - any path ending in a static-file extension;
    - anything under public/'s folders and /api/ (no page lives there).

  A page whose key contains a dot (/az/programmes/060.1) starts with a
  locale, so it is routed as a page; so is a language-less legacy URL such as
  /programmes/060.1 (its last segment is not a file extension).
*/
const FILE = /\.(?:png|jpe?g|webp|avif|gif|svg|ico|txt|xml|webmanifest|json|pdf|woff2?|css|js|map)$/i;
const NON_PAGE_DIRS = /^\/(?:assets|brand|api)(?:\/|$)/i;

/**
 * Pass the request on with a fresh CSP nonce (see src/lib/csp.ts): Next.js
 * reads it from the request's CSP header, the root layout from `x-nonce`,
 * and the browser gets the same policy. Files get one too — a missing file
 * is answered with the (scripted) 404 page.
 */
function next(req: NextRequest, lang?: string) {
  const nonce = newNonce();
  const csp = contentSecurityPolicy(nonce);
  const requestHeaders = new Headers(req.headers);
  if (lang) requestHeaders.set(LANG_HEADER, lang);
  requestHeaders.set(NONCE_HEADER, nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && isLocale(first)) return next(req, first);

  if (!first) {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}`;
    // 307 keeps "/" itself out of the index; the locale root is the canonical.
    return NextResponse.redirect(url);
  }

  // A wrongly-cased locale (/AZ/..., /En) -> the lower-case one, in one hop.
  const lower = first.toLowerCase();
  if (isLocale(lower)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${lower}${pathname.slice(pathname.indexOf(first) + first.length)}`;
    url.search = search;
    return NextResponse.redirect(url, 308);
  }

  if (FILE.test(pathname) || NON_PAGE_DIRS.test(pathname)) return next(req);

  // A page path without a language -> the Azerbaijani one. A permanent
  // redirect consolidates link equity onto the localised URL.
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}/${segments.join("/")}`;
  url.search = search;
  return NextResponse.redirect(url, 308);
}

// Everything except Next's own assets (/_next/static, /_next/image, dev HMR).
export const config = {
  matcher: ["/((?!_next/).*)"],
};
