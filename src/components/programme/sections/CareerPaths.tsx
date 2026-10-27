import RefreshErrorState from "@/components/ui/RefreshErrorState";
import { IconBriefcase } from "@/components/ui/icons";
import { EmptyState, PanelHead, Pill } from "@/components/ui/primitives";
import type { Settled } from "@/lib/api";
import type { Marked } from "@/lib/content";
import { tr } from "@/lib/i18n";
import { countLabel } from "@/lib/sections";
import type { Locale } from "@/lib/site";
import type { Gco } from "@/services/gco/gcoService";

/** On an English page, careers shown in their Azerbaijani fallback carry lang "az". */
export default function CareerPaths({ locale, items }: { locale: Locale; items: Settled<Marked<Gco>[]> }) {
  return (
    <>
      <PanelHead
        title={tr(locale, "Məzun karyera imkanları", "Graduate career paths")}
        lead={tr(
          locale,
          "Bu proqramın məzunlarının çalışa biləcəyi sahələr və vəzifələr.",
          "The fields and roles graduates of this programme go on to work in."
        )}
        aside={items.ok && items.data.length > 0 ? <Pill tone="k">{countLabel(items.data.length, locale, "career")}</Pill> : undefined}
      />

      {!items.ok ? (
        <RefreshErrorState locale={locale} />
      ) : items.data.length === 0 ? (
        <EmptyState
          icon={<IconBriefcase size={26} />}
          message={tr(
            locale,
            "Bu ixtisas üçün karyera imkanları hələ əlavə edilməyib.",
            "No career paths have been published for this programme yet."
          )}
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {items.data.map((g, idx) => (
            <li key={g.id ?? g.career_code ?? idx} className="card flex h-full flex-col p-7" lang={g.lang}>
              <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-k-100 text-k-700">
                <IconBriefcase />
              </span>
              <h3 className="t-md mt-5 [overflow-wrap:anywhere]">{g.career_title}</h3>
              {g.career_content && g.career_content.trim() && (
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2 [overflow-wrap:anywhere]">{g.career_content}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
