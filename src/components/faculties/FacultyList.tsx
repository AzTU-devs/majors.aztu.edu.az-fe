"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { facultyPath } from "@/lib/routes";
import type { Faculty } from "@/services/faculty/facultyService";
import {
  ArrowRight,
  Card,
  CodeChip,
  Container,
  EmptyState,
} from "@/components/ui/primitives";

const BuildingIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6">
    <path d="M3 21h18M5 21V6l7-3 7 3v15" strokeLinejoin="round" />
    <path d="M9 21v-5h6v5M9 10h.01M15 10h.01M9 13.5h.01M15 13.5h.01" strokeLinecap="round" />
  </svg>
);

/**
 * Faculty index. The list is fetched server-side and passed in, so it is
 * present in the crawled HTML rather than appearing after hydration.
 */
export default function FacultyList({
  locale,
  faculties,
}: {
  locale: Locale;
  faculties: Faculty[];
}) {
  if (faculties.length === 0) {
    return (
      <Container className="py-12">
        <EmptyState
          icon={BuildingIcon}
          message={tr(locale, "Fakültə tapılmadı.", "No faculties found.")}
        />
      </Container>
    );
  }

  return (
    <Container className="py-10 md:py-14">
      <p className="mb-5 text-[13.5px] font-medium text-[var(--text-muted)]">
        {locale === "az"
          ? `${faculties.length} fakültə`
          : `${faculties.length} ${faculties.length === 1 ? "faculty" : "faculties"}`}
      </p>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {faculties.map((faculty, i) => (
          <motion.li
            key={faculty.faculty_code}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04 }}
          >
            <Link href={facultyPath(locale, faculty.faculty_code)} className="block h-full">
              <Card interactive className="flex h-full flex-col p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--brand-tint)] text-[var(--brand-accent)]">
                    {BuildingIcon}
                  </span>
                  <CodeChip>{faculty.faculty_code}</CodeChip>
                </div>

                <h2 className="flex-1 text-[16px] font-bold leading-snug">{faculty.faculty_name}</h2>

                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--brand-accent)]">
                  {tr(locale, "Kafedralara bax", "View departments")}
                  <ArrowRight />
                </span>
              </Card>
            </Link>
          </motion.li>
        ))}
      </ul>
    </Container>
  );
}
