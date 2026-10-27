import RefreshErrorState from "@/components/ui/RefreshErrorState";
import { IconTarget } from "@/components/ui/icons";
import { EmptyState, PanelHead, Pill } from "@/components/ui/primitives";
import type { Settled } from "@/lib/api";
import type { Marked } from "@/lib/content";
import { tr } from "@/lib/i18n";
import { countLabel } from "@/lib/sections";
import type { Locale } from "@/lib/site";
import type { PloInterface } from "@/services/plo/ploService";

/** On an English page, outcomes shown in their Azerbaijani fallback carry lang "az". */
export default function LearningOutcomes({ locale, plos }: { locale: Locale; plos: Settled<Marked<PloInterface>[]> }) {
  return (
    <>
      <PanelHead
        title={tr(locale, "Proqram təlim məqsədləri", "Programme learning outcomes")}
        lead={tr(
          locale,
          "Məzunun proqramı bitirdikdə nümayiş etdirməli olduğu bilik və bacarıqlar.",
          "What a graduate is expected to know and be able to do on completing the programme."
        )}
        aside={plos.ok && plos.data.length > 0 ? <Pill tone="k">{`${plos.data.length} PLO`}</Pill> : undefined}
      />

      {!plos.ok ? (
        <RefreshErrorState locale={locale} />
      ) : plos.data.length === 0 ? (
        <EmptyState
          icon={<IconTarget size={26} />}
          message={tr(
            locale,
            "Bu ixtisas üçün proqram təlim məqsədləri hələ əlavə edilməyib.",
            "No programme learning outcomes have been published for this programme yet."
          )}
        />
      ) : (
        <ol className="grid gap-4 md:grid-cols-2" aria-label={countLabel(plos.data.length, locale, "outcome")}>
          {plos.data.map((p, i) => (
            <li key={p.id ?? p.plo_code ?? i} className="card flex gap-5 p-6">
              <span className="num" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-k-700">
                  PLO {i + 1}
                  {p.plo_code && <span className="code ml-2 normal-case tracking-normal text-ink-3">{p.plo_code}</span>}
                </p>
                <p className="mt-2 text-[16px] leading-relaxed text-ink [overflow-wrap:anywhere]" lang={p.lang}>
                  {p.plo_content}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
