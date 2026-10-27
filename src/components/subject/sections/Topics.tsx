import RefreshErrorState from "@/components/ui/RefreshErrorState";
import { IconBook, IconExternal } from "@/components/ui/icons";
import { EmptyState, PanelHead, Pill } from "@/components/ui/primitives";
import { TOPIC_TYPE } from "@/components/subject/sections/Syllabus";
import type { Settled } from "@/lib/api";
import type { Marked } from "@/lib/content";
import { tr } from "@/lib/i18n";
import { countLabel } from "@/lib/sections";
import type { Locale } from "@/lib/site";
import { safeExternalUrl } from "@/lib/url";
import type { Tlo } from "@/services/tlo/tloService";
import type { Topic } from "@/services/topic/topic";

export default function Topics({
  locale,
  topics,
}: {
  locale: Locale;
  /** On an English page, records shown in their Azerbaijani fallback carry lang "az". */
  topics: Settled<(Marked<Topic> & { tlos: Marked<Tlo>[] })[]>;
}) {
  return (
    <>
      <PanelHead
        title={tr(locale, "Mövzu planı", "Topic plan")}
        lead={tr(
          locale,
          "Fənn üzrə mövzular və hər mövzunun təlim nəticələri.",
          "The subject's topics and the learning outcomes attached to each one."
        )}
        aside={topics.ok && topics.data.length > 0 ? <Pill tone="k">{countLabel(topics.data.length, locale, "topic")}</Pill> : undefined}
      />

      {!topics.ok ? (
        <RefreshErrorState locale={locale} />
      ) : topics.data.length === 0 ? (
        <EmptyState
          icon={<IconBook size={26} />}
          message={tr(locale, "Bu fənn üçün mövzu əlavə edilməyib.", "No topics have been added for this subject yet.")}
        />
      ) : (
        <ol id="topic-list" className="flex flex-col gap-3">
          {topics.data.map((topic, i) => {
            const href = safeExternalUrl(topic.topic_url);
            return (
              <li key={topic.topic_key} className="card flex gap-5 p-5 sm:p-6">
                <span className="num" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <h3 className="font-display text-[17px] font-bold leading-snug tracking-[-0.01em] text-ink [overflow-wrap:anywhere]">
                      <span className="sr-only">{i + 1}. </span>
                      <span lang={topic.lang}>{topic.topic_name}</span>
                    </h3>
                    {TOPIC_TYPE[topic.topic_type] && (
                      <Pill tone="line" size="sm">
                        {TOPIC_TYPE[topic.topic_type][locale]}
                      </Pill>
                    )}
                    {topic.topic_code?.trim() && <span className="code text-[12px] text-ink-3">{topic.topic_code}</span>}
                  </div>

                  {topic.topic_desc && (
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-2 [overflow-wrap:anywhere]" lang={topic.lang}>
                      {topic.topic_desc}
                    </p>
                  )}

                  {topic.tlos.length > 0 && (
                    <div className="mt-4 rounded-[16px] bg-surface-2 p-4">
                      <p className="text-[12.5px] font-semibold text-k-700">
                        {tr(locale, "Mövzu təlim nəticələri", "Topic learning outcomes")}
                      </p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[14.5px] text-ink-2 marker:text-k-500">
                        {topic.tlos.map((tlo, idx) => (
                          <li key={`${tlo.tlo_code}-${idx}`} lang={tlo.lang}>
                            {tlo.tlo_content}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {href && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-navy underline decoration-line-2 underline-offset-4 hover:decoration-navy"
                    >
                      {tr(locale, "Mənbəyə keç", "Open resource")}
                      <span className="sr-only">
                        : {topic.topic_name} {tr(locale, "(yeni pəncərədə açılır)", "(opens in a new tab)")}
                      </span>
                      <IconExternal size={14} />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}
