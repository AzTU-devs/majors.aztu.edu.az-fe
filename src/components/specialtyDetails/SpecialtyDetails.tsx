"use client";

import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SpecialtyShell from "./SpecialtyShell";
import EmptyState from "./EmptyState";
import {
  getSpecialtyChar,
  SpecialtyChar,
} from "@/services/specialtCharacteristics/specialtyChar";

export type Locale = "az" | "en";

interface Props {
  specialtyCode: string;
}

export default function SpecialtyDetails({ specialtyCode }: Props) {
  const locale: Locale = useSelector((s: RootState) => s.locale.value);
  const [loading, setLoading] = useState(true);
  const [chars, setChars] = useState<SpecialtyChar | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSpecialtyChar(specialtyCode, locale).then((res: any) => {
      if (cancelled) return;
      setChars(res && typeof res === "object" ? res : null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [specialtyCode, locale]);

  return (
    <SpecialtyShell specialtyCode={specialtyCode} active="overview">
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <Skeleton width="40%" height={28} />
              <Skeleton variant="rectangular" height={120} className="mt-3 rounded" />
            </div>
          ))}
        </div>
      ) : chars ? (
        <div className="grid gap-5 md:grid-cols-2">
          <article className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#182f79] to-[#3b4fc2]" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#182f79]">
              {locale === "az" ? "Proqram deskripsiyası" : "Program description"}
            </h3>
            <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-gray-700">
              {chars.program_desc || "—"}
            </p>
          </article>

          <article className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#182f79] to-[#3b4fc2]" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#182f79]">
              {locale === "az" ? "Proqram tələbləri" : "Program requirements"}
            </h3>
            <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-gray-700">
              {Array.isArray(chars.degree_requirements)
                ? chars.degree_requirements.join("\n")
                : chars.degree_requirements || "—"}
            </p>
          </article>
        </div>
      ) : (
        <EmptyState
          message={
            locale === "az"
              ? "Hələ ki bu ixtisas üçün ümumi məlumat əlavə edilməyib."
              : "No overview information has been added for this specialty yet."
          }
        />
      )}
    </SpecialtyShell>
  );
}
