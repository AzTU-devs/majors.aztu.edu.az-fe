"use client";

import { Locale } from "../gco/Gco";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";
import DoneIcon from "@mui/icons-material/Done";
import Skeleton from "@mui/material/Skeleton";
import { Competency, getCompetencyBySpecialty } from "@/services/competency/competencyService";
import { Subject, getCurriculaBySpecialtyCode } from "@/services/curricula/curricula";
import { getMatchedSubjectsByCompetency } from "@/services/competencyMatch/competencyMatchService";

export default function CompetencyMatchTable() {
    const params = useParams();
    const specialtyCodeParam = params.specialtyCode;
    const specialtyCode: string = Array.isArray(specialtyCodeParam)
        ? specialtyCodeParam[0]
        : specialtyCodeParam || "";
    const locale: Locale = useSelector((state: RootState) => state.locale.value);

    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [competencies, setCompetencies] = useState<Competency[]>([]);
    const [matches, setMatches] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!specialtyCode) return;
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                const compRes = await getCompetencyBySpecialty(specialtyCode, locale);
                const compList: Competency[] = Array.isArray(compRes) ? compRes : [];

                const curricula = await getCurriculaBySpecialtyCode(specialtyCode, 0, 100, locale);
                const subjectList: Subject[] =
                    curricula && typeof curricula === "object" && Array.isArray(curricula.subjects)
                        ? curricula.subjects
                        : [];

                const matchedKeys = new Set<string>();
                const results = await Promise.all(
                    compList.map((c) => getMatchedSubjectsByCompetency(c.competency_code))
                );
                compList.forEach((c, i) => {
                    results[i].forEach((m) => matchedKeys.add(`${c.competency_code}_${m.subject_code}`));
                });

                if (!cancelled) {
                    setCompetencies(compList);
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
        title: locale === "az" ? "Səriştə uyğunluq cədvəli" : "Competency matching table",
        subtitle:
            locale === "az"
                ? "Səriştələrin fənlərlə uyğunluğu"
                : "Mapping of competencies to subjects",
        competency: locale === "az" ? "Səriştə" : "Competency",
        emptyComp:
            locale === "az" ? "Səriştə əlavə edilməyib." : "No competencies have been added.",
        emptySubject:
            locale === "az" ? "Bu ixtisas üçün fənn tapılmadı." : "No subjects found for this specialty.",
        subjects: locale === "az" ? "Fənlər" : "Subjects",
    };

    const groups = [
        { type: 1, az: "Peşə Səriştələri", en: "Job Competencies" },
        { type: 2, az: "İxtisas Səriştələri", en: "Specialty Competencies" },
    ];

    return (
        <section className="w-full px-2 md:px-6 py-4">
            <header className="mb-6 text-center">
                <h2 className="text-[#182f79] dark:text-blue-300 font-bold text-[20px]">{t.title}</h2>
                <p className="mt-1 text-[13px] text-[#64748b] dark:text-slate-400">{t.subtitle}</p>
            </header>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} variant="rounded" height={48} />
                    ))}
                </div>
            ) : competencies.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#e2e8f0] dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-800/40 py-12 text-center text-[14px] text-[#64748b] dark:text-slate-400">
                    {t.emptyComp}
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
                                    <th className="sticky left-0 z-10 bg-[#182f79] text-white text-left font-semibold px-4 py-3.5 min-w-[260px] border-r border-white/15">
                                        {t.competency}
                                    </th>
                                    {subjects.map((subject, i) => (
                                        <th
                                            key={subject.subject_code ?? i}
                                            title={subject.subject_name}
                                            className="bg-[#182f79] text-white font-semibold px-3 py-3.5 text-center whitespace-nowrap border-l border-white/15"
                                        >
                                            {subject.subject_code}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map((group) => {
                                    const groupComps = competencies.filter(
                                        (c) => (c.competency_type ?? 2) === group.type
                                    );
                                    if (groupComps.length === 0) return null;
                                    return (
                                        <Fragment key={group.type}>
                                            <tr>
                                                <td
                                                    colSpan={subjects.length + 1}
                                                    className="bg-[#eef2ff] dark:bg-slate-800 px-4 py-2 text-left text-[12px] font-semibold uppercase tracking-wide text-[#182f79] dark:text-blue-300 border-t border-[#e2e8f0] dark:border-slate-700"
                                                >
                                                    {locale === "az" ? group.az : group.en}
                                                </td>
                                            </tr>
                                            {groupComps.map((comp) => (
                                                <tr
                                                    key={comp.competency_code}
                                                    className="odd:bg-white even:bg-[#f8fafc] dark:odd:bg-slate-800 dark:even:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-slate-700/50 transition-colors"
                                                >
                                                    <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-left text-[#1e293b] dark:text-slate-100 border-t border-r border-[#e2e8f0] dark:border-slate-700 min-w-[260px]">
                                                        {comp.competency_content}
                                                    </td>
                                                    {subjects.map((subject, cIndex) => {
                                                        const matched = matches.has(
                                                            `${comp.competency_code}_${subject.subject_code}`
                                                        );
                                                        return (
                                                            <td
                                                                key={cIndex}
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
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Subject legend: code → name */}
                    <div className="mt-6">
                        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#182f79]/70 dark:text-blue-300/70">
                            {t.subjects}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {subjects.map((subject, i) => (
                                <div
                                    key={subject.subject_code ?? i}
                                    className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3"
                                >
                                    <span className="flex-shrink-0 rounded-md bg-[#182f79]/10 dark:bg-blue-400/10 px-2 py-1 text-[11px] font-bold text-[#182f79] dark:text-blue-300">
                                        {subject.subject_code}
                                    </span>
                                    <p className="text-[13px] leading-relaxed text-[#475569] dark:text-slate-300">
                                        {subject.subject_name}
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
