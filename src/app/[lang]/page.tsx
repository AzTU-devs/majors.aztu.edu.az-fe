import type { Metadata } from "next";

import Home, { type HomeProps } from "@/components/home/Home";
import { homeFaq } from "@/components/home/faq";
import JsonLd from "@/components/seo/JsonLd";
import { fetchCurriculum, fetchSpecialties, mapLimit, orFallback } from "@/lib/api";
import { cardContext, newestFirst, toCard } from "@/lib/catalogue";
import { faqSchema, graph, organizationSchema, websiteSchema } from "@/lib/jsonld";
import { ogPath } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { localeParam } from "@/lib/params";
import { SITE_DESCRIPTION } from "@/lib/site";

/** A programme counts as "new" for this long after it was added. */
const NEW_FOR_MS = 120 * 24 * 60 * 60 * 1000;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = localeParam((await params).lang);
  const title =
    locale === "az"
      ? "AzTU Təhsil Proqramları — bakalavr və magistr ixtisasları"
      : "AzTU Academic Programmes — bachelor's and master's degrees";
  return pageMetadata({
    locale,
    path: "/",
    title,
    absoluteTitle: title,
    description: SITE_DESCRIPTION[locale],
    image: ogPath(locale, "home"),
  });
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = localeParam((await params).lang);

  // Real figures read server-side, so the counts, the newest programme and
  // the carousel are in the crawled HTML. An outage only blanks them; the
  // page itself still renders.
  const [all, ctx] = await Promise.all([orFallback(fetchSpecialties(locale), null), cardContext(locale)]);

  const newest = all ? newestFirst(all) : [];
  const carouselItems = newest.slice(0, 8);
  const subjectCounts = await mapLimit(carouselItems, 4, (s) =>
    orFallback(
      fetchCurriculum(s.specialty_key, locale).then((list) => list.length),
      null
    )
  );
  const now = Date.now();

  const props: HomeProps = {
    locale,
    counts: {
      bachelor: all ? all.filter((s) => s.degree !== 2).length : null,
      master: all ? all.filter((s) => s.degree === 2).length : null,
    },
    faculties: ctx.metas.map((f) => {
      const c = ctx.index.counts[f.code];
      return { ...f, total: c?.total ?? null, bachelor: c?.bachelor ?? null, master: c?.master ?? null };
    }),
    newest: newest[0] ? toCard(newest[0], ctx.index, ctx.styles, ctx.names) : null,
    carousel: carouselItems.map((s, i) => {
      const created = s.created_at ? Date.parse(s.created_at) : NaN;
      return {
        card: toCard(s, ctx.index, ctx.styles, ctx.names),
        isNew: Number.isFinite(created) && now - created < NEW_FOR_MS,
        subjects: subjectCounts[i],
      };
    }),
    faq: homeFaq(locale),
  };

  return (
    <>
      <JsonLd data={graph(organizationSchema(locale), websiteSchema(locale), faqSchema(props.faq))} />
      <Home {...props} />
    </>
  );
}
