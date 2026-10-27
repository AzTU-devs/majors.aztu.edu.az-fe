import Link from "next/link";

import { CoverArt, TileArt } from "@/components/art/TileArt";
import { IconArrowUpRight, IconCap, IconLayers } from "@/components/ui/icons";
import { CodePill, Pill, cx } from "@/components/ui/primitives";
import type { ProgrammeCardData } from "@/lib/cards";
import { tr } from "@/lib/i18n";
import { programmePath } from "@/lib/routes";
import { countLabel, degreeLabel } from "@/lib/sections";
import type { Locale } from "@/lib/site";

/**
 * Compact programme card for long lists (catalogue, department pages): hue
 * swatch, degree and code, faculty, name, department. The whole card is one
 * link whose accessible name is the programme name.
 */
export function ProgrammeCard({
  p,
  locale,
  showDegree = true,
  as: Heading = "h3",
}: {
  p: ProgrammeCardData;
  locale: Locale;
  showDegree?: boolean;
  as?: "h2" | "h3";
}) {
  return (
    <article className={cx(p.hue, "card card-lift group flex h-full flex-col p-5 sm:p-6")}>
      <div className="flex items-start justify-between gap-3">
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[16px] bg-k-100" aria-hidden>
          <TileArt name={p.art} className="absolute inset-0 h-full w-full" />
        </span>
        <div className="flex min-w-0 flex-wrap justify-end gap-1.5">
          {showDegree && (
            <Pill tone="k" size="sm">
              {degreeLabel(p.degree, locale)}
            </Pill>
          )}
          {p.code && <CodePill className="!h-6 !px-2 !text-[11.5px] max-w-[11rem] truncate">{p.code}</CodePill>}
        </div>
      </div>

      {p.facultyName && (
        <p className="mt-5 flex items-center gap-2 text-[12.5px] font-semibold leading-snug text-k-700">
          <span className="dot" aria-hidden />
          <span className="clamp-2">{p.facultyName}</span>
        </p>
      )}
      <Heading
        className={cx(
          "font-display text-[18px] font-bold leading-[1.28] tracking-[-0.012em] text-ink [overflow-wrap:anywhere]",
          p.facultyName ? "mt-2" : "mt-5"
        )}
      >
        <Link href={programmePath(locale, p.key)} className="card-link">
          {p.name}
        </Link>
      </Heading>
      {p.cafedra && <p className="clamp-2 mt-1.5 text-[14px] leading-snug text-ink-3">{p.cafedra}</p>}

      <span
        aria-hidden
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13.5px] font-semibold text-ink-3 transition-colors group-hover:text-ink"
      >
        {tr(locale, "Proqrama keç", "Open programme")}
        <IconArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}

/** Course-card style programme card with an illustrated cover (home carousel). */
export function ProgrammeCoverCard({
  p,
  locale,
  isNew = false,
  subjects,
}: {
  p: ProgrammeCardData;
  locale: Locale;
  isNew?: boolean;
  subjects?: number | null;
}) {
  return (
    <article className={cx(p.hue, "ccard group")}>
      <div className="cover">
        <CoverArt name={p.art} label={p.code} />
        <span className="pill pill-glass absolute left-3 top-3">
          <IconCap />
          {degreeLabel(p.degree, locale)}
        </span>
        {isNew && <span className="pill pill-gold absolute right-3 top-3">{tr(locale, "Yeni", "New")}</span>}
      </div>
      <div className="px-1">
        {p.facultyName && (
          <p className="flex items-center gap-2 text-[12.5px] font-semibold leading-snug text-k-700">
            <span className="dot" aria-hidden />
            <span className="truncate">{p.facultyName}</span>
          </p>
        )}
        <h3 className="title clamp-2 mt-2">
          <Link href={programmePath(locale, p.key)} className="stretched">
            {p.name}
          </Link>
        </h3>
        {p.cafedra && <p className="mt-1 truncate text-[14px] text-ink-2">{p.cafedra}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-3">
          {p.code && <span className="code">{p.code}</span>}
          {typeof subjects === "number" && subjects > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <IconLayers size={15} />
              {countLabel(subjects, locale, "subject")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
