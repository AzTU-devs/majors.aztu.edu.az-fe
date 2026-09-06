"use client";

import { useEffect, useState } from "react";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { getTopics, type Topic } from "@/services/topic/topic";
import { getTloByTopicCode, type Tlo } from "@/services/tlo/tloService";
import { Card, EmptyState, SectionHeading, Skeleton } from "@/components/ui/primitives";

const TYPE_LABEL: Record<number, { az: string; en: string }> = {
  1: { az: "Mühazirə", en: "Lecture" },
  2: { az: "Məşğələ", en: "Seminar" },
  3: { az: "Laboratoriya", en: "Laboratory" },
  4: { az: "Sərbəst iş", en: "Independent work" },
};

interface TopicWithTlos extends Topic {
  tlos: Tlo[];
}

export default function Topics({
  locale,
  subjectCode,
}: {
  locale: Locale;
  subjectCode: string;
}) {
  const [topics, setTopics] = useState<TopicWithTlos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const list = await getTopics(subjectCode, 0, 200, locale);
      if (cancelled) return;
      const withTlos = await Promise.all(
        list.map(async (topic) => ({
          ...topic,
          tlos: await getTloByTopicCode(topic.topic_code, locale),
        }))
      );
      if (cancelled) return;
      setTopics(withTlos);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [subjectCode, locale]);

  return (
    <>
      <SectionHeading
        as="h2"
        eyebrow={tr(locale, "Mövzular", "Topics")}
        title={tr(locale, "Mövzu planı", "Topic plan")}
        subtitle={tr(
          locale,
          "Fənn üzrə mövzular və hər mövzunun təlim nəticələri.",
          "The subject's topics and the learning outcomes attached to each one."
        )}
      />

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <EmptyState
          message={tr(
            locale,
            "Bu fənn üçün mövzu əlavə edilməyib.",
            "No topics have been added for this subject yet."
          )}
        />
      ) : (
        <ol className="space-y-3">
          {topics.map((topic, i) => (
            <li key={topic.topic_code}>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--brand-tint)] text-[13px] font-extrabold text-[var(--brand-accent)]">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-[15.5px] font-bold">{topic.topic_name}</h3>
                      {TYPE_LABEL[topic.topic_type] && (
                        <span className="text-[11.5px] font-semibold text-[var(--text-muted)]">
                          {TYPE_LABEL[topic.topic_type][locale]}
                        </span>
                      )}
                    </div>

                    {topic.topic_desc && (
                      <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-muted)]">
                        {topic.topic_desc}
                      </p>
                    )}

                    {topic.tlos.length > 0 && (
                      <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-sunken)] p-4">
                        <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                          {tr(locale, "Mövzu təlim nəticələri", "Topic learning outcomes")}
                        </p>
                        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13.5px] text-[var(--text-body)] marker:text-[var(--brand-accent)]">
                          {topic.tlos.map((tlo) => (
                            <li key={tlo.tlo_code}>{tlo.tlo_content}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {topic.topic_url && (
                      <a
                        href={topic.topic_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--brand-accent)] underline-offset-2 hover:underline"
                      >
                        {tr(locale, "Mənbəyə keç", "Open resource")}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                          <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
