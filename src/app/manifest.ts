import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, SITE_DESCRIPTION, SITE_NAME, THEME_COLOR, UNIVERSITY } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME[DEFAULT_LOCALE]} — ${UNIVERSITY.nameAz}`,
    short_name: "AzTU İxtisaslar",
    description: SITE_DESCRIPTION[DEFAULT_LOCALE],
    start_url: `/${DEFAULT_LOCALE}`,
    scope: "/",
    display: "standalone",
    background_color: "#fcfaf6",
    theme_color: THEME_COLOR.light,
    lang: "az",
    dir: "ltr",
    categories: ["education"],
    // Generated from the official AzTU mark (public/brand/aztu-mark-white.png).
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
