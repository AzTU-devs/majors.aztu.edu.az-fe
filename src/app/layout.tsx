import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Albert_Sans, JetBrains_Mono, Onest } from "next/font/google";

import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import ThemeProvider from "@/components/themeProvider/ThemeProvider";
import { NONCE_HEADER } from "@/lib/csp";
import { API_BASE_URL } from "@/util/apiClient";
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  THEME_COLOR,
  UNIVERSITY,
  resolveLocale,
} from "@/lib/site";

/*
  Fonts are self-hosted by next/font (served from /_next/static/media), so the
  Content-Security-Policy needs no third-party origin. All three cover the
  Azerbaijani alphabet (ə, ğ, ı, İ, ö, ş, ü, ç) through the latin-ext subset.
*/
const albert = Albert_Sans({
  variable: "--font-albert",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jbm",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  // Codes are small and below the fold; not worth a preload.
  preload: false,
});

export const metadata: Metadata = {
  // Makes every relative URL in page metadata (canonical, OG image, …) absolute.
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME[DEFAULT_LOCALE]} — ${UNIVERSITY.nameAz}`,
  description: SITE_DESCRIPTION[DEFAULT_LOCALE],
  applicationName: SITE_NAME[DEFAULT_LOCALE],
  authors: [{ name: UNIVERSITY.nameEn, url: UNIVERSITY.url }],
  creator: UNIVERSITY.nameEn,
  publisher: UNIVERSITY.nameEn,
  category: "education",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, address: false, email: false },
  // Canonical, hreflang and Open Graph are set per page (src/lib/seo.ts):
  // declaring them here made every page that forgot them inherit the home
  // page's canonical. Icons come from src/app/{favicon.ico,icon.svg,apple-icon.png}.
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR.dark },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Applies the saved theme before first paint.
 *
 * Without this the page renders light, then flips to dark once React hydrates
 * — a visible flash on every navigation for dark-mode visitors.
 */
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'dark' && t !== 'light') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Middleware puts the resolved locale on the request so the served HTML
  // carries the right `lang` — crawlers and screen readers read the attribute
  // in the initial response, not after hydration.
  const requestHeaders = await headers();
  const locale = resolveLocale(requestHeaders.get("x-aztu-lang"));
  // The CSP allows inline scripts only with this request's nonce.
  const nonce = requestHeaders.get(NONCE_HEADER) ?? undefined;

  return (
    // The font variables go on <html>: the design tokens on :root (--f-display,
    // --f-sans, --f-mono) reference them, and a custom property can only
    // resolve variables defined on its own element or above.
    <html
      lang={HTML_LANG[locale]}
      className={`${albert.variable} ${onest.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Interactive filters call the API from the browser. */}
        <link rel="dns-prefetch" href={API_BASE_URL} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {locale === "az" ? "Əsas məzmuna keç" : "Skip to main content"}
        </a>
        <ReduxProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
