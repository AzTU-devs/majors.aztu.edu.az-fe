"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

import { IconAlert, IconRefresh } from "@/components/ui/icons";
import { Kicker, buttonClass } from "@/components/ui/primitives";
import { RetryButton } from "@/components/ui/RetryButton";
import { tr } from "@/lib/i18n";
import { resolveLocale } from "@/lib/site";

/**
 * Error boundary for every page of a language tree, inside the site header
 * and footer. "Try again" re-renders the page on the server, which retries
 * the API read that failed.
 */
export default function LangError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams();
  const locale = resolveLocale(params?.lang);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="wrap py-16 md:py-24" aria-labelledby="err-title">
      <div className="k-trans max-w-2xl">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-k-100 text-k-700">
          <IconAlert size={26} />
        </span>
        <Kicker className="mt-8">{tr(locale, "Xəta", "Error")}</Kicker>
        <h1 id="err-title" className="d-lg mt-4">
          {tr(locale, "Səhifəni yükləmək mümkün olmadı", "This page could not be loaded")}
        </h1>
        <p className="lead mt-5">
          {tr(
            locale,
            "Məlumat serverindən cavab alınmadı. Bir az sonra yenidən cəhd edin.",
            "The catalogue server did not respond. Please try again in a moment."
          )}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <RetryButton
            retrying={pending}
            onRetry={() =>
              startTransition(() => {
                router.refresh();
                reset();
              })
            }
            className={buttonClass("primary")}
          >
            <IconRefresh />
            {tr(locale, "Yenidən cəhd et", "Try again")}
          </RetryButton>
          <Link href={`/${locale}`} className={buttonClass("ghost")}>
            {tr(locale, "Ana səhifə", "Home")}
          </Link>
        </div>
      </div>
    </section>
  );
}
