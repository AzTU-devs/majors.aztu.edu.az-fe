"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";

/**
 * A section with a heading and a horizontal, scroll-snapping row of cards
 * with previous/next buttons.
 *
 * The track is a native scroll container (touch, trackpad and keyboard
 * scrolling all work; it is focusable for arrow keys). The buttons scroll by
 * one "page". At either end the button is aria-disabled rather than
 * `disabled`: a disabled button drops keyboard focus to <body> the moment the
 * last page is reached, while aria-disabled keeps it focusable (and ignores
 * presses).
 */
export default function Carousel({
  locale,
  id,
  label,
  heading,
  extra,
  children,
}: {
  locale: Locale;
  id: string;
  /** Accessible name of the list. */
  label: string;
  heading: React.ReactNode;
  /** Shown before the buttons (a "see all" link). */
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el || (dir === -1 ? edges.start : edges.end)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {heading}
        <div className="flex items-center gap-3">
          {extra}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              className="btn-icon line"
              onClick={() => page(-1)}
              aria-disabled={edges.start || undefined}
              aria-controls={id}
              aria-label={tr(locale, "Əvvəlki proqramlar", "Previous programmes")}
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              className="btn-icon line"
              onClick={() => page(1)}
              aria-disabled={edges.end || undefined}
              aria-controls={id}
              aria-label={tr(locale, "Növbəti proqramlar", "Next programmes")}
            >
              <IconChevronRight />
            </button>
          </div>
        </div>
      </div>
      <ul
        id={id}
        ref={track}
        tabIndex={0}
        aria-label={label}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-1 md:mt-12"
      >
        {children}
      </ul>
    </>
  );
}
