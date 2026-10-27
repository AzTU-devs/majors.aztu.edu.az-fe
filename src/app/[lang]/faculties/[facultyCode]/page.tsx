import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TileArt } from "@/components/art/TileArt";
import JsonLd from "@/components/seo/JsonLd";
import PageHero from "@/components/ui/PageHero";
import RefreshErrorState from "@/components/ui/RefreshErrorState";
import { IconArrowUpRight, IconCap, IconLayers, IconUsers } from "@/components/ui/icons";
import { ButtonLink, CodePill, EmptyState, PanelHead, Pill, cx } from "@/components/ui/primitives";
import { fetchCafedraSpecialties, fetchCafedras, fetchFaculties, mapLimit, orFallback, settle } from "@/lib/api";
import { facultyIndex, facultyStyle } from "@/lib/catalogue";
import { tr } from "@/lib/i18n";
import { breadcrumbSchema, graph, itemListSchema } from "@/lib/jsonld";
import { catalogPath, facultyPath, ogPath, safeDecode } from "@/lib/routes";
import { countLabel } from "@/lib/sections";
import { isTranslated, notFoundMetadata, pageMetadata, unavailableMetadata } from "@/lib/seo";
import { localeParam } from "@/lib/params";
import { SITE_NAME, type Locale } from "@/lib/site";

interface RouteParams {
  lang: string;
  facultyCode: string;
}

/**
 * The faculty, resolved from the faculty index. Null when the faculty does
 * not exist; throws when the API is unavailable (so an outage is an error
 * page, not a 404).
 */
async function findFaculty(code: string, locale: Locale) {
  const faculties = await fetchFaculties(locale);
  return faculties.find((f) => f.faculty_code === code) ?? null;
}

async function translated(code: string) {
  const [az, en] = await Promise.all([
    orFallback(fetchFaculties("az"), null),
    orFallback(fetchFaculties("en"), null),
  ]);
  if (!az || !en) return true;
  return isTranslated(
    az.find((f) => f.faculty_code === code)?.faculty_name,
    en.find((f) => f.faculty_code === code)?.faculty_name
  );
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const p = await params;
  const locale = localeParam(p.lang);
  const code = safeDecode(p.facultyCode);
  const az = locale === "az";
  const faculty = await findFaculty(code, locale).catch(() => undefined);
  if (faculty === undefined) return unavailableMetadata(az ? "Fakültə" : "Faculty");
  if (!faculty) return notFoundMetadata(az ? "Fakültə tapılmadı" : "Faculty not found");

  return pageMetadata({
    locale,
    path: `/faculties/${encodeURIComponent(code)}`,
    title: az ? `${faculty.faculty_name} — kafedralar və ixtisaslar` : `${faculty.faculty_name} — departments and programmes`,
    description: az
      ? `${faculty.faculty_name} tərkibindəki kafedralar və onların bakalavr və magistr təhsil proqramları — Azərbaycan Texniki Universiteti.`
      : `The departments within ${faculty.faculty_name} and their bachelor's and master's programmes at Azerbaijan Technical University.`,
    image: ogPath(locale, "faculty", code),
    translated: await translated(code),
  });
}

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  const p = await params;
  const locale = localeParam(p.lang);
  const code = safeDecode(p.facultyCode);
  const faculty = await findFaculty(code, locale);
  if (!faculty) notFound();

  const [style, index, cafedras] = await Promise.all([
    facultyStyle(code),
    facultyIndex(locale),
    settle(fetchCafedras(code, locale).then((list) => list ?? [])),
  ]);
  const counts = index.counts[code] ?? null;
  const programmeCounts = cafedras.ok
    ? await mapLimit(cafedras.data, 4, (c) =>
        orFallback(
          fetchCafedraSpecialties(c.cafedra_code, locale).then((l) => l.length),
          null
        )
      )
    : [];

  const crumbs = [
    { name: SITE_NAME[locale], path: `/${locale}` },
    { name: tr(locale, "Fakültələr", "Faculties"), path: `/${locale}/faculties` },
    { name: faculty.faculty_name, path: facultyPath(locale, code) },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema(crumbs),
          cafedras.ok &&
            itemListSchema(
              tr(locale, `${faculty.faculty_name} — kafedralar`, `${faculty.faculty_name} — departments`),
              facultyPath(locale, code),
              cafedras.data.map((c) => ({ name: c.cafedra_name || c.cafedra_code, path: facultyPath(locale, code, c.cafedra_code) }))
            )
        )}
      />
      <PageHero
        locale={locale}
        hue={style.hue}
        crumbs={[
          { label: tr(locale, "Ana səhifə", "Home"), href: `/${locale}` },
          { label: tr(locale, "Fakültələr", "Faculties"), href: `/${locale}/faculties` },
          { label: faculty.faculty_name },
        ]}
        kicker={tr(locale, "Fakültə", "Faculty")}
        title={faculty.faculty_name}
        lead={tr(
          locale,
          "Fakültənin kafedraları və onların bakalavr və magistr ixtisasları.",
          "The faculty's departments and their bachelor's and master's programmes."
        )}
        art={style.art}
        meta={
          <>
            {cafedras.ok && (
              <Pill tone="k0">
                <IconUsers />
                {countLabel(cafedras.data.length, locale, "department")}
              </Pill>
            )}
            {counts && (
              <>
                <Pill tone="k0">
                  <IconLayers />
                  {countLabel(counts.total, locale, "programme")}
                </Pill>
                <Pill tone="k0">
                  <IconCap />
                  {tr(locale, `${counts.bachelor} bakalavr · ${counts.master} magistr`, `${counts.bachelor} bachelor's · ${counts.master} master's`)}
                </Pill>
              </>
            )}
          </>
        }
      />

      <section className={cx(style.hue, "wrap py-12 md:py-16")} aria-labelledby="departments">
        <PanelHead
          id="departments"
          title={tr(locale, "Kafedralar", "Departments")}
          lead={tr(
            locale,
            "Kafedranı seçin — onun bütün ixtisasları bir səhifədə açılacaq.",
            "Pick a department to see every programme it runs."
          )}
          aside={
            counts && counts.total > 0 ? (
              <ButtonLink href={catalogPath(locale, undefined, { faculty: code })} tone="ghost" size="sm" arrow>
                {tr(locale, "Fakültənin bütün ixtisasları", "All programmes of this faculty")}
              </ButtonLink>
            ) : undefined
          }
        />
        {!cafedras.ok ? (
          <RefreshErrorState locale={locale} />
        ) : cafedras.data.length === 0 ? (
          <EmptyState
            icon={<IconUsers size={26} />}
            message={tr(locale, "Bu fakültə üçün kafedra tapılmadı.", "No departments were found for this faculty.")}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cafedras.data.map((c, i) => (
              <li key={c.cafedra_code} className="flex">
                <article className="card card-lift group flex w-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span aria-hidden className="relative h-14 w-14 overflow-hidden rounded-[16px] bg-k-100">
                      <TileArt name={(["blocks", "orbit", "bars", "dots", "stairs", "chip"] as const)[i % 6]} className="absolute inset-0 h-full w-full" />
                    </span>
                    <CodePill className="max-w-[10rem] truncate">{c.cafedra_code}</CodePill>
                  </div>
                  <h3 className="mt-5 font-display text-[19px] font-bold leading-snug tracking-[-0.012em] text-ink">
                    <Link href={facultyPath(locale, code, c.cafedra_code)} className="card-link">
                      {c.cafedra_name || c.cafedra_code}
                    </Link>
                  </h3>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-[14px] text-ink-3">
                    <span>
                      {typeof programmeCounts[i] === "number"
                        ? countLabel(programmeCounts[i] as number, locale, "programme")
                        : tr(locale, "Kafedra", "Department")}
                    </span>
                    <IconArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
