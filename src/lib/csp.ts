/**
 * Content-Security-Policy, set per response by the middleware.
 *
 * - Scripts: a fresh nonce per request plus 'strict-dynamic' — no
 *   'unsafe-inline'. Next.js reads the nonce from the request's CSP header
 *   and puts it on every script it emits (the inline RSC payload, the
 *   bootstrap and chunk scripts); the root layout's theme script carries it
 *   too (`x-nonce`). Scripts those load are trusted through 'strict-dynamic'.
 *   JSON-LD blocks are data, not scripts, so they need none. Every page is
 *   rendered per request anyway (the root layout reads the request headers),
 *   so a nonce costs nothing — but it also means a page can never be served
 *   from a static cache with someone else's nonce. 'unsafe-eval' is for dev
 *   (React Refresh) only.
 * - Styles: inline style attributes (tile positions, CSS variables) and
 *   next/font's @font-face rules.
 * - Fonts: next/font self-hosts Albert Sans, Onest and JetBrains Mono under
 *   /_next/static — no font origin is needed.
 * - Images: all local — inline SVG illustrations, public/ files and the
 *   social-preview images rendered at /[lang]/og/...; data:/blob: for small
 *   inline ones.
 * - connect-src: the majors API, which client components call directly.
 * - frame-src: the Google Maps embed on the contact page.
 */
const isDev = process.env.NODE_ENV !== "production";

/** Origin the browser calls for catalogue data (see src/util/apiClient.ts). */
const API_ORIGIN = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-majors.aztu.edu.az").origin;
  } catch {
    return "https://api-majors.aztu.edu.az";
  }
})();

export function contentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${API_ORIGIN}${isDev ? " ws: wss:" : ""}`,
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    "frame-src https://www.google.com https://maps.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join("; ");
}

/** A fresh, unguessable nonce (base64 of 16 random bytes). */
export function newNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

/** Request header the root layout reads the nonce from. */
export const NONCE_HEADER = "x-nonce";
