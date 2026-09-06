import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

/**
 * The frame every page shares: header, a landmark <main> the skip-link targets,
 * and the footer pinned to the bottom on short pages.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-page)]">
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
