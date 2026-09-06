import Link from "next/link";
import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Səhifə tapılmadı / Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--surface-page)] px-6 text-center">
      <p className="font-mono text-[13px] font-bold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
        404
      </p>
      <h1 className="mt-4 max-w-lg text-[28px] font-extrabold leading-tight md:text-[36px]">
        Səhifə tapılmadı
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--text-muted)]">
        Axtardığınız səhifə mövcud deyil və ya köçürülüb.
        <br />
        <span className="opacity-80">The page you are looking for does not exist or has moved.</span>
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link
          href={`/${DEFAULT_LOCALE}`}
          className="rounded-xl bg-[var(--brand)] px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] dark:text-[#0a0f2b]"
        >
          Ana səhifə / Home
        </Link>
        <Link
          href={`/${DEFAULT_LOCALE}/bachelor`}
          className="rounded-xl border border-[var(--border-strong)] px-6 py-3.5 text-[15px] font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
        >
          İxtisaslar / Programmes
        </Link>
      </div>
    </div>
  );
}
