import type { Metadata } from "next";

import ProgrammeCatalogue from "@/components/catalogue/ProgrammeCatalogue";
import JsonLd from "@/components/seo/JsonLd";
import PageHero from "@/components/ui/PageHero";
import { IconBuilding, IconLayers } from "@/components/ui/icons";
import { Pill } from "@/components/ui/primitives";
import { fetchSpecialties, settle } from "@/lib/api";
import { cardContext, toCard } from "@/lib/catalogue";
import { DEGREE_HUE, type ArtName, type Hue } from "@/lib/hues";
import { breadcrumbSchema, graph, itemListSchema } from "@/lib/jsonld";
import { catalogPath, ogPath, programmePath } from "@/lib/routes";
import { countLabel } from "@/lib/sections";
import { cleanQuery, filterProgrammes } from "@/lib/search";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME, type Locale } from "@/lib/site";
import { tr } from "@/lib/i18n";

type SearchParams = Record<string, string | string[] | undefined>;

type Degree = 1 | 2 | undefined;

function copy(locale: Locale, degree: Degree) {
  const az = locale === "az";
  if (degree === 1)
    return {
      path: "/bachelor",
      og: "bachelor",
      crumb: az ? "Bakalavr" : "Bachelor's",
      title: az ? "Bakalavr ixtisasları" : "Bachelor's programmes",
      kicker: az ? "Birinci pillə ali təhsil" : "First-cycle degrees",
      lead: az
        ? "Azərbaycan Texniki Universitetinin bütün bakalavr təhsil proqramları — adı, kodu və fakültəsi üzrə axtarın."
        : "Every undergraduate programme at Azerbaijan Technical University — search by name, code or faculty.",
      description: az
        ? "AzTU-nun bütün bakalavr ixtisasları: tədris planı, fənlər, təlim nəticələri və karyera imkanları."
        : "All bachelor's degree programmes at AzTU: curriculum, subjects, learning outcomes and career paths.",
      art: "blocks" as ArtName,
      hue: DEGREE_HUE[1] as Hue,
    };
  if (degree === 2)
    return {
      path: "/master",
      og: "master",
      crumb: az ? "Magistr" : "Master's",
      title: az ? "Magistr ixtisasları" : "Master's programmes",
      kicker: az ? "İkinci pillə ali təhsil" : "Second-cycle degrees",
      lead: az
        ? "Azərbaycan Texniki Universitetinin bütün magistr təhsil proqramları — adı, kodu və fakültəsi üzrə axtarın."
        : "Every graduate programme at Azerbaijan Technical University — search by name, code or faculty.",
      description: az
        ? "AzTU-nun bütün magistr ixtisasları: ixtisaslaşma istiqamətləri, fənlər və təlim nəticələri."
        : "All master's degree programmes at AzTU: specialisation tracks, subjects and learning outcomes.",
      art: "book" as ArtName,
      hue: DEGREE_HUE[2] as Hue,
    };
  return {
    path: "/programmes",
    og: "programmes",
    crumb: az ? "Bütün ixtisaslar" : "All programmes",
    title: az ? "Bütün ixtisaslar" : "All programmes",
    kicker: az ? "Bakalavr və magistr" : "Bachelor's and master's",
    lead: az
      ? "Universitetin bütün təhsil proqramları bir kataloqda — pilləyə, fakültəyə və ada görə süzün."
      : "All of the university's degree programmes in one catalogue — filter by level, faculty or name.",
    description: az
      ? "Azərbaycan Texniki Universitetinin bütün bakalavr və magistr ixtisasları bir kataloqda: axtarış, fakültə filtri, tədris planları və təlim nəticələri."
      : "Every bachelor's and master's programme at Azerbaijan Technical University in one catalogue: search, faculty filter, curricula and learning outcomes.",
    art: "dots" as ArtName,
    hue: "k-it" as Hue,
  };
}

/**
 * A filtered view (?q= or ?faculty=) is a search result, not a page of its
 * own: noindex (links still followed), canonical to the plain catalogue.
 */
export function catalogueMetadata(locale: Locale, degree: Degree, searchParams: SearchParams = {}): Metadata {
  const c = copy(locale, degree);
  const filtered = Boolean(cleanQuery(searchParams.q) || cleanQuery(searchParams.faculty, 60));
  return pageMetadata({
    locale,
    path: c.path,
    title: c.title,
    description: c.description,
    image: ogPath(locale, "page", c.og),
    index: !filtered,
  });
}

/**
 * /bachelor, /master and /programmes: the hero plus the catalogue.
 *
 * The whole list of the degree level is read (one cached read per level) and
 * handed to the catalogue, which filters it in memory by ?q= and ?faculty=
 * (src/lib/search.ts) — on the server for the first render, so the hero
 * search and the WebSite SearchAction land on real results in the HTML, and
 * then in the browser as the visitor types.
 */
export default async function CataloguePage({
  locale,
  degree,
  searchParams,
}: {
  locale: Locale;
  degree: Degree;
  searchParams: SearchParams;
}) {
  const c = copy(locale, degree);
  const [ctx, listed] = await Promise.all([cardContext(locale), settle(fetchSpecialties(locale, degree))]);
  const q = cleanQuery(searchParams.q);
  const requestedFaculty = cleanQuery(searchParams.faculty, 60);
  const faculty = ctx.metas.find((f) => f.code === requestedFaculty) ?? null;
  const filtered = Boolean(q || faculty);

  const all = listed.ok ? listed.data.map((s) => toCard(s, ctx.index, ctx.styles, ctx.names)) : null;
  const shown = all ? filterProgrammes(all, q, faculty?.code ?? null, ctx.index.facultyOf) : null;

  const home = { name: SITE_NAME[locale], path: `/${locale}` };
  const here = { name: c.crumb, path: catalogPath(locale, degree) };
  // A filtered list describes the filtered URL, not the whole catalogue.
  const listName = [c.title, q && `“${q}”`, faculty?.name].filter(Boolean).join(" · ");
  const listPath = filtered ? catalogPath(locale, degree, { q, faculty: faculty?.code }) : catalogPath(locale, degree);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([home, here]),
          shown &&
            itemListSchema(
              listName,
              listPath,
              shown.map((p) => ({ name: p.name, path: programmePath(locale, p.key) }))
            )
        )}
      />
      <PageHero
        locale={locale}
        hue={c.hue}
        crumbs={[{ label: tr(locale, "Ana səhifə", "Home"), href: `/${locale}` }, { label: c.crumb }]}
        kicker={c.kicker}
        title={c.title}
        lead={c.lead}
        art={c.art}
        meta={
          <>
            {all && (
              <Pill tone="k0">
                <IconLayers />
                {countLabel(all.length, locale, "programme")}
              </Pill>
            )}
            {ctx.metas.length > 0 && (
              <Pill tone="k0">
                <IconBuilding />
                {countLabel(ctx.metas.length, locale, "faculty")}
              </Pill>
            )}
          </>
        }
      />
      <ProgrammeCatalogue
        locale={locale}
        degree={degree}
        items={all}
        faculties={ctx.metas}
        facultyOf={ctx.index.facultyOf}
        unindexed={ctx.metas.filter((f) => ctx.index.counts[f.code] === null).map((f) => f.code)}
        styles={ctx.styles}
      />
    </>
  );
}
