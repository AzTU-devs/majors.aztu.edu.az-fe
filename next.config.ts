import type { NextConfig } from "next";

/*
  The Content-Security-Policy is not set here: it carries a fresh nonce per
  request, so the middleware sets it (src/middleware.ts, src/lib/csp.ts).
*/

/*
  Legacy URLs → current ones, each in a single 308 hop.

  Programmes moved from /[lang]/bachelor/specialty-details/... (which also
  filed master programmes under "bachelor") to /[lang]/programmes/..., and a
  few sub-pages were renamed or removed (the misspelled "sillabus", the SLO
  pages, the literature list). Chaining the "moved" rule with the "renamed"
  rules cost two redirects for URLs such as
  /az/bachelor/specialty-details/X/sillabus, and a URL without a language
  prefix added a third (middleware → /az/...). Every combination of old prefix
  × renamed suffix is listed explicitly, before the generic rules, so each
  legacy URL lands on its final address directly. Redirects run before the
  middleware, so the language-less forms are caught here too.
*/
const RENAMED: [string, string][] = [
  ["/:key/sillabus", "/:key/subjects"],
  ["/:key/student-learning-outcomes", "/:key/program-learning-outcomes"],
  ["/:key/literatures", "/:key/subjects"],
  ["/:key/subjects/:subject/subject-learning-outcomes", "/:key/subjects/:subject/topics"],
  ["/:key/subjects/:subject/subject-match-table", "/:key/subjects/:subject/clo-plo-match-table"],
  ["/:key/subjects/:subject/topics/topicTlos", "/:key/subjects/:subject/topics"],
];

const OLD_PREFIXES: { source: string; destination: string }[] = [
  { source: "/:lang(az|en)/programmes", destination: "/:lang/programmes" },
  { source: "/:lang(az|en)/bachelor/specialty-details", destination: "/:lang/programmes" },
  { source: "/:lang(az|en)/master/specialty-details", destination: "/:lang/programmes" },
  { source: "/programmes", destination: "/az/programmes" },
  { source: "/bachelor/specialty-details", destination: "/az/programmes" },
  { source: "/master/specialty-details", destination: "/az/programmes" },
];

const LEGACY_REDIRECTS = [
  ...OLD_PREFIXES.flatMap((prefix) =>
    RENAMED.map(([from, to]) => ({
      source: `${prefix.source}${from}`,
      destination: `${prefix.destination}${to}`,
      permanent: true,
    }))
  ),
  ...OLD_PREFIXES.filter((p) => p.source.endsWith("specialty-details")).map((prefix) => ({
    source: `${prefix.source}/:path*`,
    destination: `${prefix.destination}/:path*`,
    permanent: true,
  })),
  // The password page of the pre-launch access gate, which has been removed.
  { source: "/unlock", destination: "/az", permanent: true },
];

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Trailing slashes would give every page two addresses; keep one canonical form.
  trailingSlash: false,

  // Always render <title>, description, canonical, hreflang and Open Graph
  // tags in the initial <head>. By default Next streams metadata into the
  // <body> for clients outside a fixed bot list (Googlebot included) and
  // relies on JavaScript to hoist it; crawlers and link previewers that read
  // the raw HTML would then miss the canonical. Every page reads the same
  // (cached) data for its content anyway, so this costs nothing measurable.
  htmlLimitedBots: /.*/,
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return LEGACY_REDIRECTS;
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Two years; browsers ignore the header on plain-HTTP responses.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            // (interest-cohort, FLoC's opt-out, was dropped: browsers no
            // longer know the feature and log a warning for it.)
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
