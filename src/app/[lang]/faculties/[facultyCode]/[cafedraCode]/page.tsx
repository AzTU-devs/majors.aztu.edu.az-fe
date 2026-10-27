import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgrammeCard } from "@/components/catalogue/ProgrammeCard";
import JsonLd from "@/components/seo/JsonLd";
import PageHero from "@/components/ui/PageHero";
import RefreshErrorState from "@/components/ui/RefreshErrorState";
import { IconBuilding, IconCap, IconLayers } from "@/components/ui/icons";
import { EmptyState, Pill } from "@/components/ui/primitives";
import { fetchCafedraSpecialties, fetchCafedras, fetchFaculties, orFallback, settle } from "@/lib/api";
import { cardContext, facultyStyle, toCard } from "@/lib/catalogue";
import { tr } from "@/lib/i18n";
import { breadcrumbSchema, graph, itemListSchema } from "@/lib/jsonld";
import { facultyPath, ogPath, programmePath, safeDecode } from "@/lib/routes";
import { countLabel, degreeLabel } from "@/lib/sections";
import { localeParam } from "@/lib/params";
import { isTranslated, notFoundMetadata, pageMetadata, unavailableMetadata } from "@/lib/seo";
import { SITE_NAME, type Locale } from "@/lib/site";

interface RouteParams {
  lang: string;
  facultyCode: string;
  cafedraCode: string;
}

/**
 * Faculty + department names, read server-side so the title is meaningful.
 *
 * Null when the faculty does not exist or the department does not belong to
 * it — a deleted (or mistyped) department used to render a page titled with
 * its raw code and an empty programme list. The faculty is checked against
 * the cached faculty list before its departments are read (fetchCafedras), so
 * a random code costs no per-key read. Throws when the API is down.
 */
async function resolveNames(facultyCode: string, cafedraCode: string, locale: Locale) {
  const faculty = (await fetchFaculties(locale)).find((f) => f.faculty_code === facultyCode);
  if (!faculty) return null;
  const cafedra = (await fetchCafedras(facultyCode, locale))?.find((c) => c.cafedra_code === cafedraCode);
  if (!cafedra) return null;
  return { facultyName: faculty.faculty_name, cafedraName: cafedra.cafedra_name || cafedraCode };
}

/**
 * Department names usually already end in "kafedrası" (or "kafedra"):
 * "Kompüter mühəndisliyi kafedrası". The word is added only when it is
 * missing, so titles no longer read "… kafedrası kafedrası".
 */
const ENDS_KAFEDRA = /\s*kafedra(?:s[ıi])?\s*$/iu;

function departmentTitle(name: string, locale: Locale) {
  if (locale === "en") return name;
  return ENDS_KAFEDRA.test(name) ? name : `${name} kafedrası`;
}

/** "… kafedrasının" (of the department), from either form of the name. */
function departmentGenitive(name: string, locale: Locale) {
  if (locale === "en") return /\bdepartment\b/i.test(name) ? `the ${name}` : `the ${name} department`;
  return `${name.replace(ENDS_KAFEDRA, "")} kafedrasının`;
}

async function translated(facultyCode: string, cafedraCode: string) {
  const [az, en] = await Promise.all([
    orFallback(fetchCafedras(facultyCode, "az"), null),
    orFallback(fetchCafedras(facultyCode, "en"), null),
  ]);
  if (!az || !en) return true;
  return isTranslated(
    az.find((c) => c.cafedra_code === cafedraCode)?.cafedra_name,
    en.find((c) => c.cafedra_code === cafedraCode)?.cafedra_name
  );
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const p = await params;
  const locale = localeParam(p.lang);
  const facultyCode = safeDecode(p.facultyCode);
  const cafedraCode = safeDecode(p.cafedraCode);
  const az = locale === "az";
  const names = await resolveNames(facultyCode, cafedraCode, locale).catch(() => undefined);
  if (names === undefined) return unavailableMetadata(az ? "Kafedra" : "Department");
  if (!names) return notFoundMetadata(az ? "Kafedra tapılmadı" : "Department not found");
  const { cafedraName, facultyName } = names;

  return pageMetadata({
    locale,
    path: `/faculties/${encodeURIComponent(facultyCode)}/${encodeURIComponent(cafedraCode)}`,
    title: az ? `${departmentTitle(cafedraName, locale)} — ixtisaslar` : `${cafedraName} — programmes`,
    description: az
      ? `${departmentGenitive(cafedraName, locale)} (${facultyName}) bakalavr və magistr ixtisasları — Azərbaycan Texniki Universiteti.`
      : `Bachelor's and master's programmes run by ${departmentGenitive(cafedraName, locale)} (${facultyName}) at Azerbaijan Technical University.`,
    image: ogPath(locale, "department", facultyCode, cafedraCode),
    translated: await translated(facultyCode, cafedraCode),
  });
}

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  const p = await params;
  const locale = localeParam(p.lang);
  const facultyCode = safeDecode(p.facultyCode);
  const cafedraCode = safeDecode(p.cafedraCode);
  const names = await resolveNames(facultyCode, cafedraCode, locale);
  if (!names) notFound();
  const { cafedraName, facultyName } = names;

  const [style, ctx, programmes] = await Promise.all([
    facultyStyle(facultyCode),
    cardContext(locale),
    settle(fetchCafedraSpecialties(cafedraCode, locale)),
  ]);
  const cards = programmes.ok
    ? programmes.data.map((s) => ({
        ...toCard(s, ctx.index, ctx.styles, ctx.names),
        // Every programme here belongs to this faculty.
        hue: style.hue,
        art: style.art,
        facultyName: undefined,
        cafedra: null,
      }))
    : [];
  const groups = ([1, 2] as const)
    .map((degree) => ({ degree, items: cards.filter((c) => c.degree === degree) }))
    .filter((g) => g.items.length > 0);

  const crumbs = [
    { name: SITE_NAME[locale], path: `/${locale}` },
    { name: tr(locale, "Fakültələr", "Faculties"), path: `/${locale}/faculties` },
    { name: facultyName, path: facultyPath(locale, facultyCode) },
    { name: cafedraName, path: facultyPath(locale, facultyCode, cafedraCode) },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema(crumbs),
          programmes.ok &&
            itemListSchema(
              tr(locale, `${cafedraName} — ixtisaslar`, `${cafedraName} — programmes`),
              facultyPath(locale, facultyCode, cafedraCode),
              cards.map((c) => ({ name: c.name, path: programmePath(locale, c.key) }))
            )
        )}
      />
      <PageHero
        locale={locale}
        hue={style.hue}
        crumbs={[
          { label: tr(locale, "Ana səhifə", "Home"), href: `/${locale}` },
          { label: tr(locale, "Fakültələr", "Faculties"), href: `/${locale}/faculties` },
          { label: facultyName, href: facultyPath(locale, facultyCode) },
          { label: cafedraName },
        ]}
        kicker={tr(locale, `Kafedra · ${facultyName}`, `Department · ${facultyName}`)}
        title={cafedraName}
        lead={tr(locale, "Bu kafedraya aid bütün ixtisaslar.", "Every programme run by this department.")}
        art={style.art}
        meta={
          programmes.ok ? (
            <>
              <Pill tone="k0">
                <IconLayers />
                {countLabel(cards.length, locale, "programme")}
              </Pill>
              {groups.map((g) => (
                <Pill key={g.degree} tone="k0">
                  <IconCap />
                  {`${degreeLabel(g.degree, locale)}: ${g.items.length}`}
                </Pill>
              ))}
              <Pill tone="k0">
                <IconBuilding />
                {cafedraCode}
              </Pill>
            </>
          ) : undefined
        }
      />

      <section className="wrap py-12 md:py-16" aria-label={tr(locale, "Kafedranın ixtisasları", "The department's programmes")}>
        {!programmes.ok ? (
          <RefreshErrorState locale={locale} />
        ) : cards.length === 0 ? (
          <EmptyState
            message={tr(locale, "Bu kafedra üçün ixtisas tapılmadı.", "No programmes were found for this department.")}
          />
        ) : (
          <div className="flex flex-col gap-14">
            {groups.map((g) => (
              <div key={g.degree}>
                <h2 className="d-md flex items-baseline gap-3">
                  {degreeLabel(g.degree, locale, "list")}
                  <span className="font-sans text-[16px] font-semibold tracking-normal text-ink-3">{g.items.length}</span>
                </h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((c) => (
                    <li key={c.key}>
                      <ProgrammeCard p={c} locale={locale} showDegree={false} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
