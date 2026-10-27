import Link from "next/link";
import React from "react";

import { TileArt } from "@/components/art/TileArt";
import type { ArtName, Hue } from "@/lib/hues";
import { cx } from "./primitives";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumb trail. A real <nav>/<ol> so assistive tech and crawlers can read
 * the hierarchy; the matching BreadcrumbList JSON-LD is emitted by each page.
 */
export function Breadcrumbs({ items, locale }: { items: Crumb[]; locale: "az" | "en" }) {
  if (!items.length) return null;
  return (
    <nav aria-label={locale === "az" ? "Naviqasiya yolu" : "Breadcrumb"} className="min-w-0">
      <ol className="crumbs">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="min-w-0 [overflow-wrap:anywhere]">
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden className="sep">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Decorative tile cluster shown at the right of a detail hero. */
export function HeroCluster({ art, className }: { art: ArtName; className?: string }) {
  return (
    <div aria-hidden className={cx("grid w-full max-w-[288px] grid-cols-3 gap-2.5", className)}>
      <div className="mo col-span-2 row-span-2 !rounded-[30px] bg-k-200">
        <TileArt name={art} className="absolute inset-0 h-full w-full" />
      </div>
      <div className="mo round bg-k-0">
        <TileArt name="orbit" className="absolute inset-0 h-full w-full" />
      </div>
      <div className="mo gold">
        <TileArt name="star" className="absolute inset-0 h-full w-full" />
      </div>
      <div className="mo arch bg-k-0">
        <TileArt name="arch" className="absolute inset-0 h-full w-full" />
      </div>
      <div className="mo bg-k-200">
        <TileArt name="dots" className="absolute inset-0 h-full w-full" />
      </div>
      <div className="mo leaf bg-k-0">
        <TileArt name="blocks" className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  );
}

/**
 * The detail-page hero row used at the top of every interior page: a band in
 * the page's hue with a faint blueprint grid, breadcrumbs, kicker, the page's
 * single <h1>, a lead and meta pills.
 */
export default function PageHero({
  locale,
  hue,
  crumbs,
  kicker,
  title,
  heading,
  lead,
  meta,
  art,
  aside,
}: {
  locale: "az" | "en";
  hue: Hue;
  crumbs?: Crumb[];
  kicker?: React.ReactNode;
  /** Text of the <h1>. Ignored when `heading` supplies a custom one. */
  title?: React.ReactNode;
  heading?: React.ReactNode;
  lead?: React.ReactNode;
  meta?: React.ReactNode;
  art?: ArtName;
  aside?: React.ReactNode;
}) {
  return (
    <section className={cx("c-hero-row", hue)}>
      <div className="wrap grid gap-8 pb-10 pt-7 md:pb-12 md:pt-9 lg:grid-cols-12 lg:gap-10 lg:pb-14">
        <div className="min-w-0 lg:col-span-8">
          {crumbs && <Breadcrumbs items={crumbs} locale={locale} />}
          {kicker && <p className="kicker mt-8 md:mt-10">{kicker}</p>}
          {heading ?? <h1 className="d-lg mt-4 [overflow-wrap:anywhere]">{title}</h1>}
          {lead && <p className="lead mt-5 max-w-2xl">{lead}</p>}
          {meta && <div className="mt-7 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {(aside || art) && (
          <div className="hidden items-end justify-end lg:col-span-4 lg:flex">
            {aside ?? (art && <HeroCluster art={art} />)}
          </div>
        )}
      </div>
    </section>
  );
}
