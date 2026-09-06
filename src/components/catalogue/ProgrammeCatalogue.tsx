"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { programmePath } from "@/lib/routes";
import { getFaculties, type Faculty } from "@/services/faculty/facultyService";
import { getAllSpecialties, type Specialty } from "@/services/specialty/specialtyService";
import {
  ArrowRight,
  Badge,
  Card,
  CardSkeletonGrid,
  CodeChip,
  Container,
  EmptyState,
  cx,
} from "@/components/ui/primitives";

const SearchIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-[18px] w-[18px]">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
  </svg>
);

/**
 * The bachelor / master catalogue: search, faculty filter and the results grid.
 *
 * Both the search term and the selected faculty are sent to the API, so the
 * faculty chips actually narrow the list (previously the selection was stored
 * in local state and never used).
 */
export default function ProgrammeCatalogue({
  locale,
  degree,
}: {
  locale: Locale;
  degree: 1 | 2;
}) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [facultyCode, setFacultyCode] = useState<string | null>(null);

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [facultiesLoading, setFacultiesLoading] = useState(true);

  const [items, setItems] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce the query so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setFacultiesLoading(true);
    getFaculties(locale)
      .then((res) => {
        if (!cancelled) setFaculties(res);
      })
      .finally(() => {
        if (!cancelled) setFacultiesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAllSpecialties(locale, debounced, degree, facultyCode ?? undefined)
      .then((res) => {
        if (!cancelled) setItems(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [locale, debounced, degree, facultyCode]);

  const activeFaculty = useMemo(
    () => faculties.find((f) => f.faculty_code === facultyCode) ?? null,
    [faculties, facultyCode]
  );

  const hasFilters = Boolean(debounced || facultyCode);

  const chip = (active: boolean) =>
    cx(
      "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-200",
      active
        ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-sm dark:text-[#0a0f2b]"
        : "border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-muted)] hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
    );

  return (
    <Container className="py-10 md:py-14">
      {/* ── Filter panel ── */}
      <Card className="p-5 md:p-6">
        <label htmlFor="programme-search" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {tr(locale, "İxtisas axtar", "Search programmes")}
        </label>

        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-sunken)] px-4 py-3.5 transition-all duration-200 focus-within:border-[var(--brand-accent)] focus-within:ring-4 focus-within:ring-[var(--ring)]">
          <span className="shrink-0 text-[var(--text-muted)]">{SearchIcon}</span>
          <input
            id="programme-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tr(locale, "İxtisas adı və ya kodu ilə axtarın…", "Search by programme name or code…")}
            className="w-full bg-transparent text-[14.5px] text-[var(--text-strong)] outline-none placeholder:text-[var(--text-muted)]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label={tr(locale, "Axtarışı təmizlə", "Clear search")}
              className="shrink-0 rounded-full p-1 text-[var(--text-muted)] transition-colors hover:text-[var(--text-strong)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="mt-5 border-t border-[var(--border-subtle)] pt-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {tr(locale, "Fakültəyə görə filtr", "Filter by faculty")}
          </p>

          {facultiesLoading ? (
            <div className="flex gap-2 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-8 w-28 shrink-0 rounded-full" />
              ))}
            </div>
          ) : (
            <div role="group" aria-label={tr(locale, "Fakültə filtri", "Faculty filter")} className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              <button type="button" onClick={() => setFacultyCode(null)} aria-pressed={facultyCode === null} className={chip(facultyCode === null)}>
                {tr(locale, "Hamısı", "All")}
              </button>
              {faculties.map((f) => (
                <button
                  key={f.faculty_code}
                  type="button"
                  title={f.faculty_name}
                  onClick={() => setFacultyCode(f.faculty_code)}
                  aria-pressed={facultyCode === f.faculty_code}
                  className={chip(facultyCode === f.faculty_code)}
                >
                  {f.faculty_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* ── Result summary ── */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13.5px] font-medium text-[var(--text-muted)]" aria-live="polite">
          {loading
            ? tr(locale, "Yüklənir…", "Loading…")
            : locale === "az"
            ? // Azerbaijani nouns stay singular after a numeral.
              `${items.length} ixtisas tapıldı`
            : `${items.length} ${items.length === 1 ? "programme" : "programmes"} found`}
          {activeFaculty && !loading && (
            <span className="text-[var(--text-body)]"> · {activeFaculty.faculty_name}</span>
          )}
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFacultyCode(null);
            }}
            className="text-[13px] font-semibold text-[var(--brand-accent)] transition-opacity hover:opacity-75"
          >
            {tr(locale, "Filtrləri sıfırla", "Reset filters")}
          </button>
        )}
      </div>

      {/* ── Results ── */}
      <div className="mt-4">
        {loading ? (
          <CardSkeletonGrid count={9} height="h-[172px]" />
        ) : items.length === 0 ? (
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
            icon={SearchIcon}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s, i) => (
              <motion.li
                key={s.specialty_code}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.035 }}
              >
                <Link href={programmePath(locale, s.specialty_code)} className="block h-full">
                  <Card interactive className="flex h-full flex-col p-5">
                    <div className="mb-3.5 flex items-center justify-between gap-2">
                      <Badge tone="accent">
                        {degree === 2 ? tr(locale, "Magistr", "Master") : tr(locale, "Bakalavr", "Bachelor")}
                      </Badge>
                      <CodeChip>{s.specialty_code}</CodeChip>
                    </div>

                    <h2 className="flex-1 text-[15.5px] font-bold leading-snug">{s.specialty_name}</h2>

                    {s.cafedra_name && (
                      <p className="mt-2 line-clamp-2 text-[12.5px] leading-snug text-[var(--text-muted)]">
                        {s.cafedra_name}
                      </p>
                    )}

                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--brand-accent)]">
                      {tr(locale, "Ətraflı bax", "View details")}
                      <ArrowRight />
                    </span>
                  </Card>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
