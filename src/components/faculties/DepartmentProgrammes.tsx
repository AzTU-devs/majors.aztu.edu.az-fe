"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { programmePath } from "@/lib/routes";
import {
  getSpecialtiesByCafedraPublic,
  type Specialty,
} from "@/services/specialty/specialtyService";
import {
  ArrowRight,
  Badge,
  Card,
  CardSkeletonGrid,
  CodeChip,
  Container,
  EmptyState,
} from "@/components/ui/primitives";

export default function DepartmentProgrammes({
  locale,
  cafedraCode,
}: {
  locale: Locale;
  cafedraCode: string;
}) {
  const [items, setItems] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSpecialtiesByCafedraPublic(cafedraCode, locale, 0, 200)
      .then((res) => !cancelled && setItems(res))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [cafedraCode, locale]);

  return (
    <Container className="py-10 md:py-14">
      {!loading && items.length > 0 && (
        <p className="mb-5 text-[13.5px] font-medium text-[var(--text-muted)]">
          {locale === "az"
            ? `${items.length} ixtisas`
            : `${items.length} ${items.length === 1 ? "programme" : "programmes"}`}
        </p>
      )}

      {loading ? (
        <CardSkeletonGrid count={6} height="h-[164px]" />
      ) : items.length === 0 ? (
        <EmptyState
          message={tr(
            locale,
            "Bu kafedra üçün ixtisas tapılmadı.",
            "No programmes were found for this department."
          )}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <motion.li
              key={s.specialty_code}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04 }}
            >
              <Link href={programmePath(locale, s.specialty_code)} className="block h-full">
                <Card interactive className="flex h-full flex-col p-5">
                  <div className="mb-3.5 flex items-center justify-between gap-2">
                    <Badge tone="accent">
                      {s.degree === 2 ? tr(locale, "Magistr", "Master") : tr(locale, "Bakalavr", "Bachelor")}
                    </Badge>
                    <CodeChip>{s.specialty_code}</CodeChip>
                  </div>

                  <h2 className="flex-1 text-[15.5px] font-bold leading-snug">{s.specialty_name}</h2>

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
    </Container>
  );
}
