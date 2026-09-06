/**
 * Schema.org structured data builders.
 *
 * Rich results depend on the entity graph being consistent, so every builder
 * refers back to the same `@id`s: the university, the website, and the
 * programme/course being described.
 */

import {
  SITE_NAME,
  SITE_DESCRIPTION,
  UNIVERSITY,
  absoluteUrl,
  type Locale,
} from "./site";

const ORG_ID = absoluteUrl("/#organization");
const SITE_ID = absoluteUrl("/#website");

export function organizationSchema(locale: Locale) {
  const az = locale === "az";
  return {
    "@type": "CollegeOrUniversity",
    "@id": ORG_ID,
    name: az ? UNIVERSITY.nameAz : UNIVERSITY.nameEn,
    alternateName: UNIVERSITY.shortName,
    url: UNIVERSITY.url,
    foundingDate: UNIVERSITY.founded,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/assets/aztu-logo-dark-320.png"),
    },
    image: absoluteUrl("/aztu-campus.jpg"),
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
    sameAs: [UNIVERSITY.url],
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: absoluteUrl(`/${locale}`),
    name: SITE_NAME[locale],
    description: SITE_DESCRIPTION[locale],
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
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

/**
 * An academic programme (a specialty). `EducationalOccupationalProgram` is the
 * type Google uses for degree-programme rich results.
 */
export function programmeSchema(opts: {
  locale: Locale;
  name: string;
  code: string;
  path: string;
  degree: 1 | 2;
  description?: string;
}) {
  const az = opts.locale === "az";
  return {
    "@type": "EducationalOccupationalProgram",
    "@id": absoluteUrl(`${opts.path}#programme`),
    name: opts.name,
    identifier: opts.code,
    url: absoluteUrl(opts.path),
    description: opts.description,
    programType: opts.degree === 2 ? "Master's degree" : "Bachelor's degree",
    educationalCredentialAwarded: opts.degree === 2
      ? az ? "Magistr dərəcəsi" : "Master's degree"
      : az ? "Bakalavr dərəcəsi" : "Bachelor's degree",
    timeToComplete: opts.degree === 2 ? "P2Y" : "P4Y",
    inLanguage: opts.locale,
    provider: { "@id": ORG_ID },
  };
}

/** A single subject within a programme. */
export function courseSchema(opts: {
  locale: Locale;
  name: string;
  code: string;
  path: string;
  description?: string;
}) {
  return {
    "@type": "Course",
    "@id": absoluteUrl(`${opts.path}#course`),
    name: opts.name,
    courseCode: opts.code,
    url: absoluteUrl(opts.path),
    description: opts.description,
    inLanguage: opts.locale,
    provider: { "@id": ORG_ID },
  };
}

/** Wrap one or more schema nodes into a single `@graph` document. */
export function graph(...nodes: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
