import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Məhdud giriş / Restricted access",
  // The gate screen must never appear in search results.
  robots: { index: false, follow: false, nocache: true },
};

export default function UnlockLayout({ children }: { children: React.ReactNode }) {
  return children;
}
