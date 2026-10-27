"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { cx } from "./primitives";

export interface SectionLink {
  slug: string;
  label: string;
}

/** The section of `base` the current path is on ("" = the overview). */
function activeSlug(pathname: string, base: string, sections: SectionLink[]) {
  // Compare decoded paths: keys may percent-encode (e.g. "6005009 (050509)").
  let path = pathname;
  let root = base;
  try {
    path = decodeURIComponent(pathname);
    root = decodeURIComponent(base);
  } catch {
    // keep the raw values
  }
  const rest = path.startsWith(root) ? path.slice(root.length).replace(/^\//, "") : "";
  if (!rest) return "";
  // Longest matching section wins, so /subjects/ABC still highlights the
  // curriculum rather than falling back to the overview.
  const match = sections
    .filter((s) => s.slug && (rest === s.slug || rest.startsWith(`${s.slug}/`)))
    .sort((a, b) => b.slug.length - a.slug.length)[0];
  return match?.slug ?? "";
}

/**
 * Sticky tab strip for a programme or subject. Real links (each section is
 * its own URL), with aria-current on the active one; scrolls horizontally on
 * narrow screens and keeps the active tab in view.
 */
export default function SectionNav({
  label,
  base,
  sections,
  hrefFor,
}: {
  label: string;
  base: string;
  sections: SectionLink[];
  hrefFor: Record<string, string>;
}) {
  const pathname = usePathname() ?? "";
  const active = activeSlug(pathname, base, sections);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const current = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !current) return;
    const left = current.offsetLeft - list.clientWidth / 2 + current.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, left) });
  }, [active]);

  return (
    <div className="tabbar no-print">
      <div className="wrap">
        <nav aria-label={label}>
          <div ref={listRef} className="tabs-track no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 py-3">
            {sections.map((section) => {
              const isActive = active === section.slug;
              return (
                <Link
                  key={section.slug || "overview"}
                  href={hrefFor[section.slug]}
                  aria-current={isActive ? "page" : undefined}
                  className={cx("tab")}
                >
                  {section.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

/**
 * The page's <h1>: the programme / subject name, plus the current section on
 * every tab but the overview — so each tab's heading is as distinct as its
 * <title>.
 */
export function SectionTitle({
  name,
  base,
  sections,
  lang,
}: {
  name: string;
  base: string;
  sections: SectionLink[];
  lang?: string;
}) {
  const pathname = usePathname() ?? "";
  const active = activeSlug(pathname, base, sections);
  const current = active ? sections.find((s) => s.slug === active) : undefined;
  return (
    <h1 className="d-lg mt-4 [overflow-wrap:anywhere]">
      <span lang={lang}>{name}</span>
      {current && <span className="h1-sub">{current.label}</span>}
    </h1>
  );
}
