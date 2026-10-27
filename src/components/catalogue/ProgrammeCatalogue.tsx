"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProgrammeCard } from "@/components/catalogue/ProgrammeCard";
import { TileArt } from "@/components/art/TileArt";
import { IconClose, IconSearch } from "@/components/ui/icons";
import { CardSkeletonGrid, EmptyState, ErrorState, cx } from "@/components/ui/primitives";
import { useApi } from "@/hooks/useApi";
import { makeCard, type ProgrammeCardData } from "@/lib/cards";
import type { ArtName, FacultyStyle, Hue } from "@/lib/hues";
import { tr } from "@/lib/i18n";
import { catalogPath } from "@/lib/routes";
import { cleanQuery, filterProgrammes } from "@/lib/search";
import type { Locale } from "@/lib/site";
import { getAllSpecialties } from "@/services/specialty/specialtyService";

export interface CatalogueFaculty {
  code: string;
  name: string;
  hue: Hue;
  art: ArtName;
}

/**
 * The programme catalogue: search, degree switch, faculty filter and results.
 *
 * It receives the whole list of its degree level and filters it in memory
 * (src/lib/search.ts): the server renders the first result set from the
 * URL's ?q= and ?faculty= (so the results are in the HTML crawlers read), and
 * typing (once it pauses) or picking a faculty filters in the browser — no
 * request per keystroke, and no search term ever reaches the API.
 *
 * The URL is the source of truth. The filters start from it, are mirrored
 * back into it (history.replaceState with a null state, which Next.js picks
 * up — useSearchParams follows, no server round-trip, no history entry per
 * keystroke), and are reset from it whenever it changes from outside: Back and
 * Forward, or a link to the plain catalogue (header, footer, degree switch).
 */
export default function ProgrammeCatalogue({
  locale,
  degree,
  items,
  faculties,
  facultyOf,
  unindexed,
  styles,
}: {
  locale: Locale;
  degree?: 1 | 2;
  /** Every programme of this degree level, server-rendered; null when the API failed. */
  items: ProgrammeCardData[] | null;
  faculties: CatalogueFaculty[];
  facultyOf: Record<string, string>;
  /** Faculties whose programme list could not be read (their filter cannot be applied). */
  unindexed: string[];
  styles: Record<string, FacultyStyle>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = cleanQuery(searchParams.get("q"));
  const rawFaculty = searchParams.get("faculty");
  const urlFaculty = rawFaculty && faculties.some((f) => f.code === rawFaculty) ? rawFaculty : null;

  const [search, setSearch] = useState(urlQuery);
  const [debounced, setDebounced] = useState(urlQuery);
  const [facultyCode, setFacultyCode] = useState<string | null>(urlFaculty);

  // The filters the URL currently reflects (written by us or by a navigation).
  const synced = useRef(`${urlQuery}\n${urlFaculty ?? ""}`);

  // The URL changed from outside (Back/Forward, a link): it wins.
  useEffect(() => {
    const fromUrl = `${urlQuery}\n${urlFaculty ?? ""}`;
    if (fromUrl === synced.current) return;
    synced.current = fromUrl;
    setSearch(urlQuery);
    setDebounced(urlQuery);
    setFacultyCode(urlFaculty);
  }, [urlQuery, urlFaculty]);

  // Typing settles before it reaches the URL.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(cleanQuery(search)), 300);
    return () => clearTimeout(id);
  }, [search]);

  // Mirror the filters into the URL.
  useEffect(() => {
    const wanted = `${debounced}\n${facultyCode ?? ""}`;
    if (wanted === synced.current) return;
    synced.current = wanted;
    window.history.replaceState(null, "", catalogPath(locale, degree, { q: debounced, faculty: facultyCode ?? undefined }));
  }, [debounced, facultyCode, locale, degree]);

  const names = useMemo(() => {
    const map: Record<string, string> = {};
    for (const f of faculties) map[f.code] = f.name;
    return map;
  }, [faculties]);

  // The list itself: the server's, or — after a failed server read — loaded
  // from the browser by "try again".
  const { data: list, loading, error, retry } = useApi<ProgrammeCardData[] | null>(
    JSON.stringify([locale, degree ?? 0]),
    async (signal) => {
      const all = await getAllSpecialties(locale, "", degree, undefined, signal);
      return all.map((s) => makeCard(s, facultyOf, styles, names));
    },
    null,
    items ? { data: items } : { error: true }
  );

  // Filtered once typing pauses: one re-render (and one live-region update)
  // per pause, not per keystroke.
  const shown = useMemo(
    () => (list ? filterProgrammes(list, debounced, facultyCode, facultyOf) : []),
    [list, debounced, facultyCode, facultyOf]
  );
  const facultyUnavailable = facultyCode !== null && unindexed.includes(facultyCode);
  const failed = error || facultyUnavailable;
  const activeFaculty = faculties.find((f) => f.code === facultyCode) ?? null;
  const hasFilters = Boolean(search.trim() || facultyCode);

  const degrees: { value?: 1 | 2; label: string }[] = [
    { label: tr(locale, "Hamısı", "All") },
    { value: 1, label: tr(locale, "Bakalavr", "Bachelor's") },
    { value: 2, label: tr(locale, "Magistr", "Master's") },
  ];

  return (
    <section className="wrap py-10 md:py-14" aria-labelledby="catalogue-results">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="field-search lg:max-w-[560px] lg:flex-1">
          <IconSearch />
          <label htmlFor="programme-search" className="sr-only">
            {tr(locale, "İxtisas axtar", "Search programmes")}
          </label>
          <input
            id="programme-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tr(locale, "İxtisas adı və ya kodu ilə axtarın…", "Search by programme name or code…")}
            autoComplete="off"
            enterKeyHint="search"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDebounced("");
              }}
              aria-label={tr(locale, "Axtarışı təmizlə", "Clear search")}
              className="btn-icon !h-9 !w-9 shrink-0 text-ink-3"
            >
              <IconClose size={18} />
            </button>
          )}
        </div>

        <nav
          aria-label={tr(locale, "Təhsil pilləsi", "Degree level")}
          className="flex shrink-0 items-center gap-1 self-start rounded-full bg-surface p-1 ring-line lg:ml-auto lg:self-auto"
        >
          {degrees.map((d) => {
            const current = d.value === degree;
            return (
              <Link
                key={d.label}
                href={catalogPath(locale, d.value, { q: cleanQuery(search), faculty: facultyCode ?? undefined })}
                aria-current={current ? "page" : undefined}
                className={cx(
                  "inline-flex h-10 items-center rounded-full px-4 text-[14px] font-semibold transition-colors",
                  current ? "bg-navy text-on-navy" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                )}
              >
                {d.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {faculties.length > 0 && (
        <div
          role="group"
          aria-label={tr(locale, "Fakültə filtri", "Faculty filter")}
          className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-8 md:px-8 lg:mx-0 lg:flex-wrap lg:px-0"
        >
          <button
            type="button"
            onClick={() => setFacultyCode(null)}
            aria-pressed={facultyCode === null}
            className="k-navy chip sm plain shrink-0"
          >
            {tr(locale, "Bütün fakültələr", "All faculties")}
          </button>
          {faculties.map((f) => (
            <button
              key={f.code}
              type="button"
              title={f.name}
              onClick={() => setFacultyCode(facultyCode === f.code ? null : f.code)}
              aria-pressed={facultyCode === f.code}
              className={cx(f.hue, "chip sm with-sw shrink-0")}
            >
              <span className="sw">
                <TileArt name={f.art} />
              </span>
              <span className="max-w-[15rem] truncate">{f.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <h2 id="catalogue-results" tabIndex={-1} className="text-[15px] font-semibold text-ink-2 outline-none" aria-live="polite">
          {loading
            ? tr(locale, "Yüklənir…", "Loading…")
            : failed
            ? tr(locale, "Nəticələr", "Results")
            : locale === "az"
            ? // Azerbaijani nouns stay singular after a numeral.
              `${shown.length} ixtisas tapıldı`
            : `${shown.length} ${shown.length === 1 ? "programme" : "programmes"} found`}
          {activeFaculty && !loading && !failed && <span className="text-ink-3"> · {activeFaculty.name}</span>}
        </h2>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setDebounced("");
              setFacultyCode(null);
            }}
            className="btn btn-quiet btn-sm"
          >
            <IconClose size={16} />
            {tr(locale, "Filtrləri sıfırla", "Reset filters")}
          </button>
        )}
      </div>

      <div className="mt-6" aria-busy={loading || undefined}>
        {facultyUnavailable && !error ? (
          // The programme → faculty index of this faculty failed on the server.
          <ErrorState locale={locale} onRetry={() => router.refresh()} returnFocusTo="catalogue-results" />
        ) : error ? (
          <ErrorState locale={locale} onRetry={retry} retrying={loading} returnFocusTo="catalogue-results" />
        ) : loading && !list ? (
          <CardSkeletonGrid count={9} height="h-[230px]" />
        ) : shown.length === 0 ? (
          <EmptyState
            title={tr(locale, "Nəticə tapılmadı", "No programmes found")}
            message={
              hasFilters
                ? tr(
                    locale,
                    "Axtarış sorğunuzu dəyişin və ya fakültə filtrini sıfırlayın.",
                    "Try a different search term, or clear the faculty filter."
                  )
                : tr(
                    locale,
                    "Bu təhsil pilləsi üzrə hələ ixtisas əlavə edilməyib.",
                    "No programmes have been published for this degree level yet."
                  )
            }
            icon={<IconSearch size={26} />}
          />
        ) : (
          <ul
            className={cx(
              "grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3",
              (loading || cleanQuery(search) !== debounced) && "opacity-60"
            )}
          >
            {shown.map((p) => (
              <li key={p.key}>
                <ProgrammeCard p={p} locale={locale} showDegree={!degree} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
