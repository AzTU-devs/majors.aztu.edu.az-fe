import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, SITE_DESCRIPTION, SITE_NAME, UNIVERSITY } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME[DEFAULT_LOCALE]} — ${UNIVERSITY.nameAz}`,
    short_name: UNIVERSITY.shortName,
    description: SITE_DESCRIPTION[DEFAULT_LOCALE],
    start_url: `/${DEFAULT_LOCALE}`,
    scope: "/",
    display: "standalone",
    background_color: "#f6f7fb",
    theme_color: "#141e53",
    lang: "az",
    dir: "ltr",
    categories: ["education"],
    icons: [
      { src: "/assets/aztu-logo-dark-320.png", sizes: "320x320", type: "image/png", purpose: "any" },
    ],
  };
}
