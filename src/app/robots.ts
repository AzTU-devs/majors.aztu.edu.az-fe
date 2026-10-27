import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing of value lives under /api/, and it would otherwise burn
        // crawl budget.
        disallow: ["/api/"],
      },
    ],
    // No `Host:` line: it is a non-standard Yandex directive and expects a
    // bare host name — the scheme-qualified value it used to carry was invalid.
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
