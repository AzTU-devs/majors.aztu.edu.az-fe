"use client";

import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SpecialtyShell from "@/components/specialtyDetails/SpecialtyShell";
import EmptyState from "@/components/specialtyDetails/EmptyState";
import { getCloBySubjectCode } from "@/services/clo/clo";
import {
  getCurriculaBySpecialtyCode,
  Subject,
} from "@/services/curricula/curricula";

type Locale = "az" | "en";

export default function Page() {
  const params = useParams();
  const raw = params.specialtyCode;
  const specialtyCode = Array.isArray(raw) ? raw[0] : raw || "";
  const locale: Locale = useSelector((s: RootState) => s.locale.value);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [perSubject, setPerSubject] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const res: any = await getCurriculaBySpecialtyCode(specialtyCode, 0, 100, locale);
      const subs: Subject[] = res && typeof res === "object" && Array.isArray(res.subjects) ? res.subjects : [];
      if (cancelled) return;
      setSubjects(subs);

      const map: Record<string, any[]> = {};
      await Promise.all(
        subs.map(async (s) => {
          const r = await getCloBySubjectCode(s.subject_code, locale);
          map[s.subject_code] = Array.isArray(r) ? r : [];
        })
      );
      if (cancelled) return;
      setPerSubject(map);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [specialtyCode, locale]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <SpecialtyShell
          specialtyCode={specialtyCode}
          active="clo"
          subtitle={locale === "az" ? "Təlim Nəticələri" : "Course Learning Outcomes"}
        >
          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} variant="rectangular" height={120} className="rounded-2xl" />
              ))}
            </div>
          ) : subjects.length === 0 ? (
            <EmptyState
              message={
                locale === "az"
                  ? "Hələ ki fənn əlavə edilməyib. CLO-lar fənnlər əsasında göstərilir."
                  : "No subjects yet. CLOs are shown per subject."
              }
            />
          ) : (
            <div className="space-y-6">
              {subjects.map((s) => {
                const clos = perSubject[s.subject_code] || [];
                return (
                  <section
                    key={s.subject_code}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <header className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-[#182f79]/5 to-transparent px-6 py-4">
                      <div>
                        <p className="text-[11px] font-mono font-medium text-gray-500">
                          {s.subject_code}
                        </p>
                        <h3 className="text-base font-semibold text-gray-900">
                          {s.subject_name}
                        </h3>
                      </div>
                      <Link
                        href={`/${locale}/bachelor/specialty-details/${specialtyCode}/subjects/${s.subject_code}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#182f79]/10 px-3 py-1.5 text-xs font-medium text-[#182f79] transition hover:bg-[#182f79] hover:text-white"
                      >
                        {locale === "az" ? "Fənn səhifəsi" : "Subject page"}
                        <ArrowForwardIcon sx={{ fontSize: 14 }} />
                      </Link>
                    </header>

                    {clos.length === 0 ? (
                      <p className="px-6 py-5 text-sm text-gray-500">
                        {locale === "az" ? "CLO əlavə edilməyib." : "No CLOs yet."}
                      </p>
                    ) : (
                      <ol className="divide-y divide-gray-100">
                        {clos.map((c: any, idx: number) => (
                          <li key={idx} className="flex gap-4 px-6 py-4">
                            <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg bg-[#182f79]/10 text-xs font-bold text-[#182f79]">
                              {idx + 1}
                            </span>
                            <p className="text-sm leading-relaxed text-gray-700">
                              {c.clo_content}
                            </p>
                          </li>
                        ))}
                      </ol>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </SpecialtyShell>
      </main>
      <Footer />
    </div>
  );
}
