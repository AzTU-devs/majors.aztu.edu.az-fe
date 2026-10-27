import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { facultyMetas } from "@/lib/catalogue";
import type { Locale } from "@/lib/site";

/**
 * The frame every page shares: header, a landmark <main> the skip-link
 * targets, and the footer pinned to the bottom on short pages. The faculty
 * list (header panel, footer column) is decorative here — an outage leaves it
 * empty instead of failing the page.
 */
export default async function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const faculties = await facultyMetas(locale);
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} faculties={faculties} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer locale={locale} faculties={faculties} />
    </div>
  );
}
