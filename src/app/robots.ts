import type { MetadataRoute } from "next";
import { GATE_ENABLED, absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  // While the password gate is on there is nothing a crawler can reach, so ask
  // search engines to stay away rather than let them index the unlock screen.
  if (GATE_ENABLED) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing of value lives under these, and they would otherwise burn
        // crawl budget on duplicate content.
        disallow: ["/api/", "/unlock"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
