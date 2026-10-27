import RefreshErrorState from "@/components/ui/RefreshErrorState";
import { IconMatrix } from "@/components/ui/icons";
import { EmptyState, PanelHead, Pill, TickIcon } from "@/components/ui/primitives";
import type { Settled } from "@/lib/api";
import type { Marked } from "@/lib/content";
import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import type { Clo } from "@/services/clo/clo";
import type { PloInterface } from "@/services/plo/ploService";

/**
 * CLO ↔ PLO matrix for one subject: which programme outcome each of the
 * subject's course outcomes contributes to. Ordinal labels (CLO 1, PLO 2)
 * head the table — the stored codes are long random identifiers — and a text
 * version follows.
 */
export default function CloPloMatrix({
  locale,
  data,
}: {
  locale: Locale;
  /** On an English page, records shown in their Azerbaijani fallback carry lang "az". */
  data: Settled<{ clos: Marked<Clo>[]; plos: Marked<PloInterface>[]; matches: Set<string> }>;
}) {
  const header = (
    <PanelHead
      title={tr(locale, "CLO ↔ PLO uyğunluq cədvəli", "CLO ↔ PLO matching table")}
      lead={tr(
        locale,
        "Fənn təlim nəticələrinin proqram təlim məqsədlərinə uyğunluğu.",
        "How this subject's course outcomes map onto the programme's learning outcomes."
      )}
      aside={
        data.ok && data.data.clos.length > 0 && data.data.plos.length > 0 ? (
          <Pill tone="k">{`${data.data.clos.length} CLO × ${data.data.plos.length} PLO`}</Pill>
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
  const { clos, plos, matches } = data.data;
  if (clos.length === 0 || plos.length === 0) {
    return (
      <>
        {header}
        <EmptyState
          icon={<IconMatrix size={26} />}
          message={
            clos.length === 0
              ? tr(locale, "Bu fənn üçün təlim nəticəsi əlavə edilməyib.", "No course outcomes have been added for this subject.")
              : tr(locale, "Bu ixtisas üçün proqram təlim məqsədi əlavə edilməyib.", "No programme learning outcomes have been added.")
          }
        />
      </>
    );
  }

  const hit = (clo: Clo, plo: PloInterface) => matches.has(`${clo.clo_code ?? ""}__${plo.plo_code}`);

  return (
    <>
      {header}
      <div className="tbl-frame">
        <div className="tbl-scroll" tabIndex={0} role="region" aria-label={tr(locale, "CLO↔PLO matrisi", "CLO↔PLO matrix")}>
          <table className="tbl">
            <thead>
              <tr>
                <th scope="col" className="sticky-col min-w-[260px] max-w-[360px]">
                  {tr(locale, "Fənn təlim nəticəsi", "Course outcome")}
                </th>
                {plos.map((p, j) => (
                  <th key={p.plo_code} scope="col" className="!px-2 text-center">
                    <abbr title={p.plo_content} lang={p.lang} className="no-underline">
                      PLO {j + 1}
                    </abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clos.map((clo, i) => (
                <tr key={`${clo.clo_code ?? ""}-${i}`}>
                  <th scope="row" className="sticky-col min-w-[260px] max-w-[360px] text-left font-normal">
                    <span className="block text-[12px] font-semibold text-k-700">
                      CLO {i + 1}
                      {clo.clo_code && <span className="code ml-2 font-normal text-ink-3">{clo.clo_code}</span>}
                    </span>
                    <span className="mt-1 block text-[13.5px] leading-snug text-ink" lang={clo.lang}>
                      {clo.clo_content}
                    </span>
                  </th>
                  {plos.map((p, j) => (
                    <td key={p.plo_code} className="!px-2 text-center !align-middle">
                      {hit(clo, p) ? (
                        <span className="mtick" title={`CLO ${i + 1} → PLO ${j + 1}`}>
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

      <section className="mt-12" aria-labelledby="clo-plo-text">
        <h3 id="clo-plo-text" className="t-md">
          {tr(locale, "Proqram təlim məqsədləri", "Programme learning outcomes")}
        </h3>
        <ol className="mt-5 grid gap-3 md:grid-cols-2">
          {plos.map((p, j) => {
            const from = clos.map((c, i) => (hit(c, p) ? i + 1 : 0)).filter(Boolean);
            return (
              <li key={p.plo_code} className="card flex gap-4 p-5">
                <span className="num" aria-hidden>
                  {j + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-k-700">PLO {j + 1}</p>
                  <p className="mt-1 text-[14.5px] leading-snug text-ink">{p.plo_content}</p>
                  <p className="mt-2 text-[13px] text-ink-3">
                    {from.length
                      ? `${tr(locale, "Töhfə verən", "Supported by")}: ${from.map((n) => `CLO ${n}`).join(", ")}`
                      : tr(locale, "Bu fənndən töhfə yoxdur", "No contribution from this subject")}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
