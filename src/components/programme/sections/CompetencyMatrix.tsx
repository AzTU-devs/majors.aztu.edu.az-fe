import Link from "next/link";

import RefreshErrorState from "@/components/ui/RefreshErrorState";
import { IconMatrix } from "@/components/ui/icons";
import { EmptyState, PanelHead, Pill, TickIcon } from "@/components/ui/primitives";
import type { Settled, SubjectSummary } from "@/lib/api";
import type { Marked } from "@/lib/content";
import { tr } from "@/lib/i18n";
import { subjectPath } from "@/lib/routes";
import type { Locale } from "@/lib/site";
import type { Competency } from "@/services/competency/competencyService";

/**
 * Competency ↔ subject matrix.
 *
 * Rows are competencies, columns are subjects; a tick means the subject
 * contributes to that competency. The table scrolls inside its own frame so a
 * wide curriculum never makes the page scroll sideways, and a text version
 * below lists the contributing subjects of each competency (the column
 * headers are codes, which a screen reader or a phone reads poorly).
 */
export default function CompetencyMatrix({
  locale,
  specialtyKey,
  data,
}: {
  locale: Locale;
  specialtyKey: string;
  /** On an English page, records shown in their Azerbaijani fallback carry lang "az". */
  data: Settled<{ subjects: Marked<SubjectSummary>[]; competencies: Marked<Competency>[]; matches: Set<string> }>;
}) {
  const header = (
    <PanelHead
      title={tr(locale, "Səriştə uyğunluq cədvəli", "Competency matching table")}
      lead={tr(
        locale,
        "Hansı fənnin hansı səriştəyə töhfə verdiyini göstərir.",
        "Shows which subject contributes to which competency."
      )}
      aside={
        data.ok && data.data.competencies.length > 0 && data.data.subjects.length > 0 ? (
          <Pill tone="k">
            {tr(
              locale,
              `${data.data.competencies.length} səriştə × ${data.data.subjects.length} fənn`,
              `${data.data.competencies.length} competencies × ${data.data.subjects.length} subjects`
            )}
          </Pill>
        ) : undefined
      }
    />
  );

  if (!data.ok) {
    return (
      <>
        {header}
        <RefreshErrorState locale={locale} />
      </>
    );
  }

  const { subjects, competencies, matches } = data.data;
  if (competencies.length === 0 || subjects.length === 0) {
    return (
      <>
        {header}
        <EmptyState
          icon={<IconMatrix size={26} />}
          message={
            competencies.length === 0
              ? tr(locale, "Səriştə əlavə edilməyib.", "No competencies have been added.")
              : tr(locale, "Bu ixtisas üçün fənn tapılmadı.", "No subjects found for this programme.")
          }
        />
      </>
    );
  }

  const hit = (c: Competency, s: SubjectSummary) => matches.has(`${c.competency_code}__${s.subject_key}`);

  return (
    <>
      {header}
      <div className="tbl-frame">
        <div className="tbl-scroll max-h-[72vh]" tabIndex={0} role="region" aria-label={tr(locale, "Səriştə matrisi", "Competency matrix")}>
          <table className="tbl">
            <thead>
              <tr>
                <th scope="col" className="sticky-col min-w-[240px] max-w-[320px] !align-bottom">
                  {tr(locale, "Səriştə", "Competency")}
                </th>
                {subjects.map((s) => (
                  <th key={s.subject_key} scope="col" className="!px-1.5 !py-3 text-center !align-bottom">
                    <abbr
                      title={s.subject_name}
                      lang={s.lang}
                      className="code inline-block max-h-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] normal-case tracking-normal text-ink-2 no-underline [writing-mode:vertical-rl] rotate-180"
                    >
                      {s.subject_code || s.subject_name}
                    </abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {competencies.map((c, i) => (
                <tr key={c.id ?? c.competency_code}>
                  <th scope="row" className="sticky-col min-w-[240px] max-w-[320px] text-left font-normal">
                    <span className="block text-[12px] font-semibold text-k-700">
                      {tr(locale, "Səriştə", "Competency")} {i + 1}
                      {c.competency_code && <span className="code ml-2 font-normal text-ink-3">{c.competency_code}</span>}
                    </span>
                    <span className="mt-1 block text-[13.5px] leading-snug text-ink" lang={c.lang}>
                      {c.competency_content}
                    </span>
                  </th>
                  {subjects.map((s) => (
                    <td key={s.subject_key} className="!px-1.5 text-center !align-middle">
                      {hit(c, s) ? (
                        <span className="mtick" title={`${s.subject_name} → ${tr(locale, "səriştə", "competency")} ${i + 1}`}>
                          <TickIcon />
                          <span className="sr-only">{tr(locale, "uyğundur", "matches")}</span>
                        </span>
                      ) : (
                        <>
                          <span aria-hidden className="text-line-2">
                            ·
                          </span>
                          <span className="sr-only">{tr(locale, "uyğun deyil", "does not match")}</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="mt-12" aria-labelledby="matrix-text">
        <h3 id="matrix-text" className="t-md">
          {tr(locale, "Mətn görünüşü", "Text version")}
        </h3>
        <ol className="mt-5 grid gap-4 md:grid-cols-2">
          {competencies.map((c, i) => {
            const contributing = subjects.filter((s) => hit(c, s));
            return (
              <li key={c.id ?? c.competency_code} className="card p-6">
                <p className="text-[12px] font-semibold text-k-700">
                  {tr(locale, "Səriştə", "Competency")} {i + 1}
                </p>
                <p className="mt-1 text-[15px] leading-snug text-ink" lang={c.lang}>
                  {c.competency_content}
                </p>
                {contributing.length === 0 ? (
                  <p className="mt-3 text-[14px] text-ink-3">{tr(locale, "Uyğun fənn qeyd olunmayıb.", "No contributing subject recorded.")}</p>
                ) : (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {contributing.map((s) => (
                      <li key={s.subject_key}>
                        <Link href={subjectPath(locale, specialtyKey, s.subject_key)} lang={s.lang} className="pill pill-k hover:underline">
                          {s.subject_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
