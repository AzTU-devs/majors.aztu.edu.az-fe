import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter, IBM_Plex_Sans } from "next/font/google";

import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import ThemeProvider from "@/components/themeProvider/ThemeProvider";
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  UNIVERSITY,
  resolveLocale,
} from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Used for headings. IBM Plex Sans has full Azerbaijani coverage (ə, ğ, ı, ş, ç)
// and reads as engineered rather than decorative — a good fit for a technical
// university.
const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  // Makes every relative URL below (canonical, OG image, …) absolute.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME[DEFAULT_LOCALE]} — ${UNIVERSITY.nameAz}`,
    template: `%s | ${UNIVERSITY.shortName}`,
  },
  description: SITE_DESCRIPTION[DEFAULT_LOCALE],
  keywords: SITE_KEYWORDS[DEFAULT_LOCALE],
  applicationName: SITE_NAME[DEFAULT_LOCALE],
  authors: [{ name: UNIVERSITY.nameEn, url: UNIVERSITY.url }],
  creator: UNIVERSITY.nameEn,
  publisher: UNIVERSITY.nameEn,
  category: "education",
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME[DEFAULT_LOCALE],
    title: `${SITE_NAME[DEFAULT_LOCALE]} — ${UNIVERSITY.nameAz}`,
    description: SITE_DESCRIPTION[DEFAULT_LOCALE],
    url: `${SITE_URL}/${DEFAULT_LOCALE}`,
    locale: "az_AZ",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/aztu-campus.jpg",
        width: 1920,
        height: 1280,
        alt: UNIVERSITY.nameAz,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME[DEFAULT_LOCALE]} — ${UNIVERSITY.shortName}`,
    description: SITE_DESCRIPTION[DEFAULT_LOCALE],
    images: ["/aztu-campus.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: `${SITE_URL}/${DEFAULT_LOCALE}`,
    languages: {
      "az-AZ": `${SITE_URL}/az`,
      en: `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/az`,
    },
  },
  // Favicon/apple icon come from src/app/icon.png.
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#141e53" },
    { media: "(prefers-color-scheme: dark)", color: "#070b1a" },
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

  return (
    <html lang={HTML_LANG[locale]} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Warm up the API origin before the first client fetch. */}
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-majors.aztu.edu.az"}
          crossOrigin=""
        />
      </head>
      <body className={`${inter.variable} ${plex.variable} antialiased`}>
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
