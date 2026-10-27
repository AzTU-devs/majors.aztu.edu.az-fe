import RefreshErrorState from "@/components/ui/RefreshErrorState";
import { IconBulb } from "@/components/ui/icons";
import { EmptyState, PanelHead, Pill } from "@/components/ui/primitives";
import type { Settled } from "@/lib/api";
import type { Marked } from "@/lib/content";
import { tr } from "@/lib/i18n";
import { countLabel } from "@/lib/sections";
import type { Locale } from "@/lib/site";
import type { Competency } from "@/services/competency/competencyService";

/** competency_type: 1 = job/professional, anything else = specialty/general. */
export const COMPETENCY_GROUPS = [
  { type: 1, az: "Peşə səriştələri", en: "Professional competencies", hue: "k-it" },
  { type: 2, az: "İxtisas səriştələri", en: "Specialty competencies", hue: "k-build" },
] as const;

export const competencyGroup = (c: Competency) => (c.competency_type === 1 ? 1 : 2);

/** On an English page, competencies shown in their Azerbaijani fallback carry lang "az". */
export default function Competencies({ locale, items }: { locale: Locale; items: Settled<Marked<Competency>[]> }) {
  return (
    <>
      <PanelHead
        title={tr(locale, "Proqram səriştələri", "Programme competencies")}
        lead={tr(
          locale,
          "Məzunun əldə etdiyi peşə və ixtisas səriştələri.",
          "The professional and specialty competencies a graduate acquires."
        )}
        aside={items.ok && items.data.length > 0 ? <Pill tone="k">{countLabel(items.data.length, locale, "competency")}</Pill> : undefined}
      />

      {!items.ok ? (
        <RefreshErrorState locale={locale} />
      ) : items.data.length === 0 ? (
        <EmptyState
          icon={<IconBulb size={26} />}
          message={tr(
            locale,
            "Bu ixtisas üçün səriştələr hələ əlavə edilməyib.",
            "No competencies have been published for this programme yet."
          )}
        />
      ) : (
        <div className="flex flex-col gap-12">
          {COMPETENCY_GROUPS.map((group) => {
            // Anything that is not explicitly "professional" (1) goes in the
            // specialty group, so an unexpected type can never hide a row.
            const groupItems = items.data.filter((c) => competencyGroup(c) === group.type);
            if (groupItems.length === 0) return null;
            return (
              <section key={group.type} className={group.hue} aria-labelledby={`competency-group-${group.type}`}>
                <h3 id={`competency-group-${group.type}`} className="mb-5 flex items-center gap-3 text-[16px] font-semibold text-ink">
                  <span aria-hidden className="h-[2px] w-7 rounded bg-k-500" />
                  {tr(locale, group.az, group.en)}
                  <span className="font-normal text-ink-3">· {groupItems.length}</span>
                </h3>
                <ul className="grid gap-4 md:grid-cols-2">
                  {groupItems.map((c, idx) => (
                    <li key={c.id ?? c.competency_code ?? idx} className="card flex h-full items-start gap-4 p-6">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-k-100 text-k-700">
                        <IconBulb />
                      </span>
                      <div className="min-w-0">
                        {c.competency_code && <p className="code text-[12px] text-ink-3">{c.competency_code}</p>}
                        <p className="mt-1 text-[15.5px] leading-relaxed text-ink [overflow-wrap:anywhere]" lang={c.lang}>
                          {c.competency_content}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
