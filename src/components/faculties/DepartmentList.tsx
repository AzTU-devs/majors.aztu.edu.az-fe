"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { facultyPath } from "@/lib/routes";
import { getCafedrasByFaculty, type Cafedra } from "@/services/cafedra/cafedraService";
import {
  ArrowRight,
  Card,
  CardSkeletonGrid,
  CodeChip,
  Container,
  EmptyState,
} from "@/components/ui/primitives";

const DeptIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6">
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M8 8V5a2 2 0 012-2h4a2 2 0 012 2v3M3 13h18" strokeLinecap="round" />
  </svg>
);

export default function DepartmentList({
  locale,
  facultyCode,
}: {
  locale: Locale;
  facultyCode: string;
}) {
  const [cafedras, setCafedras] = useState<Cafedra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCafedrasByFaculty(facultyCode, locale)
      .then((res) => !cancelled && setCafedras(res))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [facultyCode, locale]);

  return (
    <Container className="py-10 md:py-14">
      {!loading && cafedras.length > 0 && (
        <p className="mb-5 text-[13.5px] font-medium text-[var(--text-muted)]">
          {locale === "az"
            ? `${cafedras.length} kafedra`
            : `${cafedras.length} ${cafedras.length === 1 ? "department" : "departments"}`}
        </p>
      )}

      {loading ? (
        <CardSkeletonGrid count={6} height="h-[164px]" />
      ) : cafedras.length === 0 ? (
        <EmptyState
          icon={DeptIcon}
          message={tr(
            locale,
            "Bu fakültə üçün kafedra tapılmadı.",
            "No departments were found for this faculty."
          )}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cafedras.map((cafedra, i) => (
            <motion.li
              key={cafedra.cafedra_code}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04 }}
            >
              <Link href={facultyPath(locale, facultyCode, cafedra.cafedra_code)} className="block h-full">
                <Card interactive className="flex h-full flex-col p-6">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--brand-tint)] text-[var(--brand-accent)]">
                      {DeptIcon}
                    </span>
                    <CodeChip>{cafedra.cafedra_code}</CodeChip>
                  </div>

                  <h2 className="flex-1 text-[15.5px] font-bold leading-snug">{cafedra.cafedra_name}</h2>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--brand-accent)]">
                    {tr(locale, "İxtisaslara bax", "View programmes")}
                    <ArrowRight />
                  </span>
                </Card>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </Container>
  );
}
