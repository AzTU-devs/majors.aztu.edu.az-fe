"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { AztuMark } from "@/components/brand/AztuMark";
import { buttonClass } from "@/components/ui/primitives";
import { resolveLocale } from "@/lib/site";

/**
 * Last-resort error boundary (errors outside a language tree, or in its
 * layout). Kept dependency-light: the site chrome may be what failed.
 */
export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = resolveLocale((usePathname() ?? "").split("/")[1]);
  const az = locale === "az";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="grid min-h-screen place-items-center bg-paper px-5 py-16 text-center">
      <div className="max-w-lg">
        <AztuMark className="mx-auto h-14 w-auto" />
        <h1 className="d-md mt-8">{az ? "Gözlənilməz xəta baş verdi" : "Something went wrong"}</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-2">
          {az ? "Səhifəni yenidən yükləməyə cəhd edin." : "Please try loading the page again."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className={buttonClass("primary")}>
            {az ? "Yenidən cəhd et" : "Try again"}
          </button>
          <a href={`/${locale}`} className={buttonClass("ghost")}>
            {az ? "Ana səhifə" : "Home"}
          </a>
        </div>
      </div>
    </main>
  );
}
