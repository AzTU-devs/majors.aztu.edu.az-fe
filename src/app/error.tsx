"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary. Without one, a thrown render error shows the
 * default Next.js error screen with no way back into the site.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--surface-page)] px-6 text-center">
      <p className="font-mono text-[13px] font-bold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
        Xəta / Error
      </p>
      <h1 className="mt-4 max-w-lg text-[26px] font-extrabold leading-tight md:text-[32px]">
        Gözlənilməz xəta baş verdi
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--text-muted)]">
        Səhifəni yenidən yükləməyə cəhd edin.
        <br />
        <span className="opacity-80">Something went wrong. Please try loading the page again.</span>
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-9 rounded-xl bg-[var(--brand)] px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] dark:text-[#0a0f2b]"
      >
        Yenidən cəhd et / Try again
      </button>
    </div>
  );
}
