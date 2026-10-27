"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { ErrorState } from "./primitives";

/**
 * Error state for a server-rendered section: "Try again" re-renders the page
 * on the server (router.refresh), which retries the API read. The rest of the
 * page — header, hero, tabs — stays as it is.
 */
export default function RefreshErrorState({ locale }: { locale: "az" | "en" }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div aria-busy={pending || undefined}>
      <ErrorState
        locale={locale}
        retrying={pending}
        onRetry={() => startTransition(() => router.refresh())}
      />
    </div>
  );
}
