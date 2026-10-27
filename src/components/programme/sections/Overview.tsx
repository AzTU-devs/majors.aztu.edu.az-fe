import Link from "next/link";

import RefreshErrorState from "@/components/ui/RefreshErrorState";
import {
  IconArrowUpRight,
  IconBriefcase,
  IconBulb,
  IconDoc,
  IconLayers,
  IconMatrix,
  IconTarget,
} from "@/components/ui/icons";
import { EmptyState, InfoRow } from "@/components/ui/primitives";
import type { Settled } from "@/lib/api";
import { tr } from "@/lib/i18n";
import { facultyPath, programmePath } from "@/lib/routes";
import { PROGRAMME_SECTIONS, countLabel, degreeLabel, sectionLabel } from "@/lib/sections";
import type { Locale } from "@/lib/site";
import type { SpecialtyChar } from "@/services/specialtCharacteristics/specialtyChar";

export default function Overview({
  locale,
  specialtyKey,
  code,
  degree,
  chars,
  charsLang,
  facts,
  counts,
}: {
  locale: Locale;
  specialtyKey: string;
  code: string;
  degree: 1 | 2;
  chars: Settled<SpecialtyChar | null>;
  /** "az" when an English page shows the Azerbaijani description and requirements. */
  charsLang?: "az";
  facts: { cafedra: string | null; facultyCode: string | null; facultyName: string | null };
  counts: { subjects: number | null; plos: number | null; competencies: number | null; careers: number | null };
}) {
  const requirements =
    chars.ok && chars.data
      ? Array.isArray(chars.data.degree_requirements)
        ? (chars.data.degree_requirements as string[]).join("\n")
        : chars.data.degree_requirements
      : "";
  const description = chars.ok && chars.data ? chars.data.program_desc : "";

  const explore = [
    { slug: "subjects", icon: <IconLayers />, count: counts.subjects, noun: "subject" as const },
    { slug: "program-learning-outcomes", icon: <IconTarget />, count: counts.plos, noun: "outcome" as const },
    { slug: "clo", icon: <IconDoc />, count: null, noun: null },
    { slug: "competency", icon: <IconBulb />, count: counts.competencies, noun: "competency" as const },
    { slug: "competency-match-table", icon: <IconMatrix />, count: null, noun: null },
    { slug: "graduate-career-opportunities", icon: <IconBriefcase />, count: counts.careers, noun: "career" as const },
  ];

  const blurb: Record<string, [string, string]> = {
    subjects: ["Bütün fənlər, kreditlər və sillabuslar", "Every subject, its credits and syllabus"],
    "program-learning-outcomes": ["Məzunun bilik və bacarıqları", "What a graduate knows and can do"],
    clo: ["Hər fənn üzrə təlim nəticələri", "Learning outcomes of each subject"],
    competency: ["Peşə və ixtisas səriştələri", "Professional and specialty competencies"],
    "competency-match-table": ["Fənlərin səriştələrə töhfəsi", "How subjects build each competency"],
    "graduate-career-opportunities": ["Məzunların çalışdığı sahələr", "Where graduates go on to work"],
  };

  return (
    <div className="flex flex-col gap-14">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          {!chars.ok ? (
            <RefreshErrorState locale={locale} />
          ) : description || requirements ? (
            <>
              {description && (
                <section className="card p-7 md:p-9" aria-labelledby="about">
                  <h2 id="about" className="t-lg">
                    {tr(locale, "Proqram haqqında", "About the programme")}
                  </h2>
                  <p className="prose-text mt-4" lang={charsLang}>
                    {description}
                  </p>
                </section>
              )}
              {requirements && (
                <section className="card p-7 md:p-9" aria-labelledby="requirements">
                  <h2 id="requirements" className="t-lg">
                    {tr(locale, "Dərəcə tələbləri", "Degree requirements")}
                  </h2>
                  <p className="prose-text mt-4" lang={charsLang}>
                    {requirements}
                  </p>
                </section>
              )}
            </>
          ) : (
            <EmptyState
              title={tr(locale, "Təsvir hazırlanır", "Description coming soon")}
              message={tr(
                locale,
                "Bu ixtisasın ümumi təsviri hələ əlavə edilməyib. Tədris planı, təlim nəticələri və karyera bölmələrinə aşağıdan keçə bilərsiniz.",
                "A description has not been published for this programme yet. The curriculum, outcomes and career sections are linked below."
              )}
              className="h-full"
            />
          )}
        </div>

        <aside className="lg:col-span-4" aria-labelledby="facts">
          <div className="card p-7">
            <h2 id="facts" className="t-md">
              {tr(locale, "Bir baxışda", "At a glance")}
            </h2>
            <dl className="mt-3">
              <InfoRow label={tr(locale, "Təhsil pilləsi", "Degree level")} value={degreeLabel(degree, locale)} />
              {code && <InfoRow label={tr(locale, "İxtisas kodu", "Programme code")} value={<span className="code">{code}</span>} />}
              {facts.cafedra && <InfoRow label={tr(locale, "Kafedra", "Department")} value={facts.cafedra} />}
              {facts.facultyCode && facts.facultyName && (
                <InfoRow
                  label={tr(locale, "Fakültə", "Faculty")}
                  value={
                    <Link href={facultyPath(locale, facts.facultyCode)} className="underline decoration-gold decoration-2 underline-offset-4">
                      {facts.facultyName}
                    </Link>
                  }
                />
              )}
              {counts.subjects !== null && (
                <InfoRow label={tr(locale, "Fənlər", "Subjects")} value={counts.subjects} />
              )}
              {counts.plos !== null && (
                <InfoRow label={tr(locale, "Təlim məqsədləri", "Learning outcomes")} value={counts.plos} />
              )}
            </dl>
          </div>
        </aside>
      </div>

      <section aria-labelledby="explore">
        <h2 id="explore" className="d-md">
          {tr(locale, "Proqramı araşdırın", "Explore the programme")}
        </h2>
        <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {explore.map((e) => (
            <li key={e.slug}>
              <article className="card card-lift group flex h-full items-start gap-4 p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-k-100 text-k-700">{e.icon}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="t-md">
                    <Link href={programmePath(locale, specialtyKey, e.slug)} className="card-link">
                      {sectionLabel(PROGRAMME_SECTIONS, e.slug, locale)}
                    </Link>
                  </h3>
                  <p className="mt-1 text-[14.5px] leading-snug text-ink-3">{tr(locale, ...blurb[e.slug])}</p>
                  {e.noun && e.count !== null && e.count > 0 && (
                    <p className="mt-3 text-[13.5px] font-semibold text-k-700">{countLabel(e.count, locale, e.noun)}</p>
                  )}
                </div>
                <IconArrowUpRight size={18} className="mt-1 shrink-0 text-ink-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </article>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
