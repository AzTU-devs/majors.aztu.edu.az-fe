/**
 * Schema.org structured data builders.
 *
 * Rich results depend on the entity graph being consistent, so every builder
 * refers back to the same `@id`s: the university, the website, and the
 * programme/course being described. Rendered by components/seo/JsonLd, which
 * escapes "<" so a stray "</script>" in a name cannot break out of the tag.
 */

import {
  SITE_DESCRIPTION,
  SITE_NAME,
  UNIVERSITY,
  absoluteUrl,
  type Locale,
} from "./site";

const ORG_ID = absoluteUrl("/#organization");
const SITE_ID = absoluteUrl("/#website");

function orgName(locale: Locale) {
  return locale === "az" ? UNIVERSITY.nameAz : UNIVERSITY.nameEn;
}

/** The university, in full (home and contact pages). */
export function organizationSchema(locale: Locale) {
  const az = locale === "az";
  return {
    "@type": "CollegeOrUniversity",
    "@id": ORG_ID,
    name: orgName(locale),
    alternateName: [UNIVERSITY.shortName, az ? UNIVERSITY.nameEn : UNIVERSITY.nameAz],
    url: UNIVERSITY.url,
    foundingDate: UNIVERSITY.founded,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/assets/aztu-logo-dark-320.png"),
    },
    email: UNIVERSITY.email,
    telephone: UNIVERSITY.phones[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: az ? UNIVERSITY.address.streetAz : UNIVERSITY.address.streetEn,
      addressLocality: az ? UNIVERSITY.address.cityAz : UNIVERSITY.address.cityEn,
      postalCode: UNIVERSITY.address.postalCode,
      addressCountry: UNIVERSITY.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: UNIVERSITY.geo.lat,
      longitude: UNIVERSITY.geo.lng,
    },
    contactPoint: UNIVERSITY.phones.map((telephone) => ({
      "@type": "ContactPoint",
      telephone,
      email: UNIVERSITY.email,
      contactType: az ? "məlumat" : "general enquiries",
      availableLanguage: ["az", "en"],
    })),
    sameAs: [UNIVERSITY.url],
  };
}

/** A reference to the university, for `provider` fields on inner pages. */
export function organizationRef(locale: Locale) {
  return { "@type": "CollegeOrUniversity", "@id": ORG_ID, name: orgName(locale), url: UNIVERSITY.url };
}

/** The site, with the catalogue search as its SearchAction. */
export function websiteSchema(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: absoluteUrl(`/${locale}`),
    name: SITE_NAME[locale],
    description: SITE_DESCRIPTION[locale],
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl(`/${locale}/programmes?q={search_term_string}`),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface Crumb {
  name: string;
  /** Site-relative path, e.g. `/az/bachelor`. */
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** A list page (catalogue, faculty index, department …). Lists every item. */
export function itemListSchema(name: string, path: string, items: { name: string; path: string }[]) {
  return {
    "@type": "ItemList",
    name,
    url: absoluteUrl(path),
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

/**
 * An academic programme. `EducationalOccupationalProgram` is the type Google
 * uses for degree programmes. No duration or credit total: the API does not
 * record them, and the old hard-coded "P4Y"/"P2Y" was a guess.
 */
export function programmeSchema(opts: {
  locale: Locale;
  name: string;
  code: string;
  /** Path of the programme overview (the entity's @id). */
  path: string;
  degree: 1 | 2;
  description: string;
  department?: string | null;
  courses?: { name: string; code: string; path: string }[];
}) {
  const az = opts.locale === "az";
  return {
    "@type": "EducationalOccupationalProgram",
    "@id": absoluteUrl(`${opts.path}#programme`),
    name: opts.name,
    identifier: opts.code || undefined,
    url: absoluteUrl(opts.path),
    description: opts.description,
    programType: opts.degree === 2 ? "Master's degree" : "Bachelor's degree",
    educationalCredentialAwarded:
      opts.degree === 2
        ? az
          ? "Magistr dərəcəsi"
          : "Master's degree"
        : az
        ? "Bakalavr dərəcəsi"
        : "Bachelor's degree",
    inLanguage: opts.locale,
    provider: organizationRef(opts.locale),
    ...(opts.department ? { offeredBy: { "@type": "Organization", name: opts.department, parentOrganization: { "@id": ORG_ID } } } : {}),
    ...(opts.courses?.length
      ? {
          hasCourse: opts.courses.map((c) => ({
            "@type": "Course",
            name: c.name,
            courseCode: c.code || undefined,
            url: absoluteUrl(c.path),
          })),
        }
      : {}),
  };
}

/** A single subject within a programme. */
export function courseSchema(opts: {
  locale: Locale;
  name: string;
  code: string;
  path: string;
  description: string;
  credits?: number | null;
  programme: { name: string; path: string };
}) {
  return {
    "@type": "Course",
    "@id": absoluteUrl(`${opts.path}#course`),
    name: opts.name,
    courseCode: opts.code || undefined,
    url: absoluteUrl(opts.path),
    description: opts.description,
    inLanguage: opts.locale,
    provider: organizationRef(opts.locale),
    ...(typeof opts.credits === "number" && opts.credits > 0 ? { numberOfCredits: opts.credits } : {}),
    isPartOf: {
      "@type": "EducationalOccupationalProgram",
      "@id": absoluteUrl(`${opts.programme.path}#programme`),
      name: opts.programme.name,
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Wrap one or more schema nodes into a single `@graph` document. */
export function graph(...nodes: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
