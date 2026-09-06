import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Trailing slashes would give every page two addresses; keep one canonical form.
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      // Programmes moved from /[lang]/bachelor/specialty-details/... to
      // /[lang]/programmes/... — the old path filed master programmes under
      // "bachelor". 308s so search engines transfer the existing ranking.
      {
        source: "/:lang(az|en)/bachelor/specialty-details/:path*",
        destination: "/:lang/programmes/:path*",
        permanent: true,
      },
      {
        source: "/:lang(az|en)/master/specialty-details/:path*",
        destination: "/:lang/programmes/:path*",
        permanent: true,
      },
      // The old misspelled route, and the SLO pages for a module that was
      // removed from the platform.
      {
        source: "/:lang(az|en)/programmes/:specialtyCode/sillabus",
        destination: "/:lang/programmes/:specialtyCode/subjects",
        permanent: true,
      },
      {
        source: "/:lang(az|en)/programmes/:specialtyCode/student-learning-outcomes",
        destination: "/:lang/programmes/:specialtyCode/program-learning-outcomes",
        permanent: true,
      },
      {
        source: "/:lang(az|en)/programmes/:specialtyCode/literatures",
        destination: "/:lang/programmes/:specialtyCode/subjects",
        permanent: true,
      },
      {
        source:
          "/:lang(az|en)/programmes/:specialtyCode/subjects/:subjectCode/subject-learning-outcomes",
        destination: "/:lang/programmes/:specialtyCode/subjects/:subjectCode/topics",
        permanent: true,
      },
      {
        source: "/:lang(az|en)/programmes/:specialtyCode/subjects/:subjectCode/subject-match-table",
        destination: "/:lang/programmes/:specialtyCode/subjects/:subjectCode/clo-plo-match-table",
        permanent: true,
      },
      {
        source: "/:lang(az|en)/programmes/:specialtyCode/subjects/:subjectCode/topics/topicTlos",
        destination: "/:lang/programmes/:specialtyCode/subjects/:subjectCode/topics",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Baseline hardening. The site has no cross-origin embeds to protect,
          // so these are safe defaults rather than a full CSP.
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
