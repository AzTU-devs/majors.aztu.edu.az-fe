// middleware.ts (in src/ because this project uses the src directory)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GATE_COOKIE, GATE_TOKEN } from "./lib/gate";

const ALLOWED_LANGS = ["az", "en"] as const;
const DEFAULT_LANG = "az";

/** Header the root layout reads to render the correct `<html lang>`. */
const LANG_HEADER = "x-aztu-lang";

/**
 * The password gate can be switched off per environment. It hides the site from
 * visitors *and* from search engines, so SEO only takes effect with SITE_GATE=off.
 */
const GATE_ENABLED = (process.env.SITE_GATE ?? "on").toLowerCase() !== "off";

function withLangHeader(req: NextRequest, lang: string) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(LANG_HEADER, lang);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // The unlock page must always be reachable.
  if (pathname === "/unlock" || pathname.startsWith("/unlock/")) {
    return NextResponse.next();
  }

  // Password gate: without a valid access cookie, send the visitor to /unlock
  // (remembering where they wanted to go via ?next=).
  if (GATE_ENABLED) {
    const unlocked = req.cookies.get(GATE_COOKIE)?.value === GATE_TOKEN;
    if (!unlocked) {
      const url = req.nextUrl.clone();
      url.pathname = "/unlock";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
  }

  // ---- Language routing ----
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LANG}`;
    // 307 keeps "/" itself out of the index; the locale root is the canonical.
    return NextResponse.redirect(url);
  }

  const firstSegment = segments[0];
  if (!ALLOWED_LANGS.includes(firstSegment as (typeof ALLOWED_LANGS)[number])) {
    const restPath = segments.join("/");
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LANG}/${restPath}`;
    url.search = search;
    // A permanent redirect consolidates link equity onto the localised URL
    // instead of leaving two addresses for the same page.
    return NextResponse.redirect(url, 308);
  }

  return withLangHeader(req, firstSegment);
}

// Run on page routes only — skip API, Next internals, and static files.
// The trailing `.*\..*` also keeps /robots.txt and /sitemap.xml out of the
// gate, so crawlers can always read them.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
