"use client";

import { Locale } from "../gco/Gco";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DoneIcon from "@mui/icons-material/Done";
import Skeleton from "@mui/material/Skeleton";
import { PloInterface, getPloBySpecialty } from "@/services/plo/ploService";
import { Subject, getCurriculaBySpecialtyCode } from "@/services/curricula/curricula";
import { getMatchedPlosBySubject } from "@/services/match/matchService";

export default function SubjectMatchTable() {
    const params = useParams();
    const specialtyCodeParam = params.specialtyCode;
    const specialtyCode: string = Array.isArray(specialtyCodeParam)
        ? specialtyCodeParam[0]
        : specialtyCodeParam || "";
    const [loading, setLoading] = useState(false);
    const [plos, setPlos] = useState<PloInterface[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    // Set of `${subject_code}_${plo_code}` keys that are matched.
    const [matches, setMatches] = useState<Set<string>>(new Set());
    const locale: Locale = useSelector((state: RootState) => state.locale.value);

    useEffect(() => {
        if (!specialtyCode) return;
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                const plosData = await getPloBySpecialty(specialtyCode, locale);
                const ploList: PloInterface[] = Array.isArray(plosData) ? plosData : [];

                const curricula = await getCurriculaBySpecialtyCode(
                    specialtyCode,
                    0,
                    100,
                    locale
                );
                const subjectList: Subject[] =
                    curricula && typeof curricula === "object" && Array.isArray(curricula.subjects)
                        ? curricula.subjects
                        : [];

                // Fetch every subject's matched PLOs in parallel.
                const matchedKeys = new Set<string>();
                const results = await Promise.all(
                    subjectList.map((s) => getMatchedPlosBySubject(s.subject_code))
                );
                subjectList.forEach((s, i) => {
                    results[i].forEach((m) =>
                        matchedKeys.add(`${s.subject_code}_${m.plo_code}`)
                    );
                });

                if (!cancelled) {
                    setPlos(ploList);
                    setSubjects(subjectList);
                    setMatches(matchedKeys);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [locale, specialtyCode]);

    const t = {
        title: locale === "az" ? "Fənnin uyğunluq cədvəli" : "Subjects' matching table",
        subtitle:
            locale === "az"
                ? "Fənlərin proqram təlim nəticələri (PLO) ilə uyğunluğu"
                : "Mapping of subjects to programme learning outcomes (PLO)",
        subject: locale === "az" ? "Fənn" : "Subject",
        emptyPlo:
            locale === "az"
                ? "Proqram təlim nəticəsi (PLO) əlavə edilməyib."
                : "No programme learning outcomes (PLO) have been added.",
        emptySubject:
            locale === "az"
                ? "Bu ixtisas üçün fənn tapılmadı."
                : "No subjects found for this specialty.",
        legend: locale === "az" ? "İşarələmə" : "Legend",
    };

    const ploLabel = (plo: PloInterface, index: number) =>
        plo.plo_code || `PLO${index + 1}`;

    return (
        <section className="w-full px-2 md:px-6 py-4">
            <header className="mb-6 text-center">
                <h2 className="text-[#182f79] dark:text-blue-300 font-bold text-[20px]">
                    {t.title}
                </h2>
                <p className="mt-1 text-[13px] text-[#64748b] dark:text-slate-400">
                    {t.subtitle}
                </p>
            </header>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} variant="rounded" height={48} />
                    ))}
                </div>
            ) : plos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#e2e8f0] dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-800/40 py-12 text-center text-[14px] text-[#64748b] dark:text-slate-400">
                    {t.emptyPlo}
                </div>
            ) : subjects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#e2e8f0] dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-800/40 py-12 text-center text-[14px] text-[#64748b] dark:text-slate-400">
                    {t.emptySubject}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-2xl border border-[#e2e8f0] dark:border-slate-700 shadow-sm">
                        <table className="w-full border-collapse text-[13px]">
                            <thead>
                                <tr>
                                    <th className="sticky left-0 z-10 bg-[#182f79] text-white text-left font-semibold px-4 py-3.5 min-w-[220px] border-r border-white/15">
                                        {t.subject}
                                    </th>
                                    {plos.map((plo, index) => (
                                        <th
                                            key={plo.id ?? index}
                                            title={plo.plo_content}
                                            className="bg-[#182f79] text-white font-semibold px-3 py-3.5 text-center whitespace-nowrap border-l border-white/15"
                                        >
                                            {ploLabel(plo, index)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((subject, rIndex) => (
                                    <tr
                                        key={subject.subject_code ?? rIndex}
                                        className="odd:bg-white even:bg-[#f8fafc] dark:odd:bg-slate-800 dark:even:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-left font-medium text-[#1e293b] dark:text-slate-100 border-t border-r border-[#e2e8f0] dark:border-slate-700 min-w-[220px]">
                                            {subject.subject_name}
                                        </td>
                                        {plos.map((plo, cIndex) => {
                                            const matched = matches.has(
                                                `${subject.subject_code}_${plo.plo_code}`
                                            );
                                            return (
                                                <td
                                                    key={plo.id ?? cIndex}
                                                    className="px-3 py-3 text-center border-t border-l border-[#e2e8f0] dark:border-slate-700"
                                                >
                                                    {matched && (
                                                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                                                            <DoneIcon fontSize="small" />
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Legend: PLO code → full content */}
                    <div className="mt-6">
                        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#182f79]/70 dark:text-blue-300/70">
                            {t.legend}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {plos.map((plo, index) => (
                                <div
                                    key={plo.id ?? index}
                                    className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3"
                                >
                                    <span className="flex-shrink-0 rounded-md bg-[#182f79]/10 dark:bg-blue-400/10 px-2 py-1 text-[11px] font-bold text-[#182f79] dark:text-blue-300">
                                        {ploLabel(plo, index)}
                                    </span>
                                    <p className="text-[13px] leading-relaxed text-[#475569] dark:text-slate-300">
                                        {plo.plo_content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
