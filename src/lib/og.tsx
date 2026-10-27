/**
 * Social-preview images (Open Graph / Twitter), 1200×630, in the site's
 * style: brand-navy field, blueprint grid, gold accents, the AzTU mark and
 * the page title, with a tile cluster in the page's hue.
 *
 * Rendered by Satori (next/og), which needs WOFF/TTF fonts — the files in
 * src/assets/og (Albert Sans 800, Onest 500/600; SIL OFL, licences beside
 * them; both cover the Azerbaijani alphabet) — and understands neither CSS
 * classes nor oklch(), hence the hex palette below.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { AZTU_MARK_PATH } from "@/components/brand/AztuMark";
import type { Hue } from "./hues";
import { SITE_URL } from "./site";

/** sRGB equivalents of the light-theme hue levels (globals.css .k-*). */
const PALETTE: Record<Hue, { k100: string; k300: string; k500: string; k700: string }> = {
  "k-it": { k100: "#e2edff", k300: "#b4cbff", k500: "#7899f8", k700: "#415aa9" },
  "k-data": { k100: "#d5f2ff", k300: "#8ed8f7", k500: "#00afe3", k700: "#006d98" },
  "k-eng": { k100: "#ffe7d7", k300: "#fabd99", k500: "#e3813f", k700: "#974600" },
  "k-biz": { k100: "#f7ecd2", k300: "#e3ca8b", k500: "#e1b850", k700: "#7f5a00" },
  "k-res": { k100: "#fce4f8", k300: "#eeb8e5", k500: "#d27ac6", k700: "#894081" },
  "k-build": { k100: "#d6f5ea", k300: "#91dfc6", k500: "#00bb94", k700: "#007758" },
  "k-trans": { k100: "#ffe4e1", k300: "#ffb7b1", k500: "#eb7671", k700: "#9d3c3a" },
  "k-energy": { k100: "#e2f3db", k300: "#b3d9a2", k500: "#86c665", k700: "#3b7019" },
  "k-navy": { k100: "#deeeff", k300: "#a8cfff", k500: "#5ea0f7", k700: "#2760a8" },
  "k-gold": { k100: "#f7ecd2", k300: "#e3ca8b", k500: "#deb95c", k700: "#7f5a00" },
};

const NAVY = "#003876";
const GOLD = "#c8a951";

let fontsPromise: Promise<{ name: string; data: Buffer; weight: 500 | 600 | 800; style: "normal" }[]> | null = null;

function loadFonts() {
  if (!fontsPromise) {
    const dir = join(process.cwd(), "src", "assets", "og");
    fontsPromise = Promise.all([
      readFile(join(dir, "AlbertSans-ExtraBold.woff")).then((data) => ({ name: "Albert Sans", data, weight: 800 as const, style: "normal" as const })),
      readFile(join(dir, "Onest-Medium.woff")).then((data) => ({ name: "Onest", data, weight: 500 as const, style: "normal" as const })),
      readFile(join(dir, "Onest-SemiBold.woff")).then((data) => ({ name: "Onest", data, weight: 600 as const, style: "normal" as const })),
    ]).catch(() => {
      // Fall back to the bundled default font rather than failing the image.
      fontsPromise = null;
      return [];
    });
  }
  return fontsPromise;
}

function titleSize(title: string) {
  const n = title.length;
  if (n <= 28) return 84;
  if (n <= 46) return 70;
  if (n <= 70) return 58;
  return 48;
}

function clip(text: string, max: number) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/** One pastel tile of the cluster, drawn with plain SVG (no CSS classes). */
function Tile({ hue, kind, size }: { hue: Hue; kind: "rings" | "bars" | "dots" | "arch"; size: number }) {
  const c = PALETTE[hue];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: kind === "dots" ? size : 30,
        background: c.k100,
        display: "flex",
        overflow: "hidden",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        {kind === "rings" && (
          <g>
            <circle cx="50" cy="50" r="36" fill="none" stroke={c.k500} strokeWidth="7" strokeDasharray="44 16" />
            <circle cx="50" cy="50" r="20" fill="none" stroke={c.k300} strokeWidth="7" />
            <circle cx="50" cy="50" r="8" fill={c.k700} />
          </g>
        )}
        {kind === "bars" && (
          <g>
            <rect x="16" y="54" width="16" height="30" rx="6" fill={c.k300} />
            <rect x="42" y="38" width="16" height="46" rx="6" fill={c.k500} />
            <rect x="68" y="18" width="16" height="66" rx="6" fill={c.k700} />
          </g>
        )}
        {kind === "dots" &&
          [20, 40, 60, 80].flatMap((y, r) =>
            [20, 40, 60, 80].map((x, col) => (
              <circle
                key={`${r}-${col}`}
                cx={x}
                cy={y}
                r={(r + col) % 3 === 0 ? 6 : 4.5}
                fill={r === 1 && col === 2 ? GOLD : (r * 4 + col) % 2 ? c.k500 : c.k300}
              />
            ))
          )}
        {kind === "arch" && (
          <g>
            <path d="M22 100V52a28 28 0 0 1 56 0v48Z" fill="#ffffff" />
            <path d="M36 100V60a14 14 0 0 1 28 0v40Z" fill={c.k500} />
          </g>
        )}
      </svg>
    </div>
  );
}

export function renderOgImage({
  kicker,
  title,
  subtitle,
  hue = "k-navy",
  wordmark,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  hue?: Hue;
  /** Second line of the wordmark ("İxtisaslar" / "Programmes"). */
  wordmark: string;
}) {
  const cleanTitle = clip(title, 110);
  const host = SITE_URL.replace(/^https?:\/\//, "");
  return loadFonts().then(
    (fonts) =>
      new ImageResponse(
        (
          <div
            style={{
              width: 1200,
              height: 630,
              display: "flex",
              position: "relative",
              background: NAVY,
              color: "#ffffff",
              fontFamily: "Onest",
              overflow: "hidden",
            }}
          >
            {/* Blueprint grid fading to the right */}
            <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
              {Array.from({ length: 31 }, (_, i) => (
                <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="630" stroke="#ffffff" strokeOpacity={0.06} />
              ))}
              {Array.from({ length: 16 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 40} x2="1200" y2={i * 40} stroke="#ffffff" strokeOpacity={0.06} />
              ))}
              <circle cx="1080" cy="80" r="360" fill="#0b4a93" fillOpacity={0.55} />
            </svg>

            <div style={{ display: "flex", flexDirection: "column", width: 760, padding: "64px 0 56px 72px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <svg width="30" height="56" viewBox="0 0 276 512">
                  <path d={AZTU_MARK_PATH} fill="#ffffff" fillOpacity={0.92} />
                </svg>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: 4, color: GOLD }}>AZTU</span>
                  <span style={{ fontFamily: "Albert Sans", fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>{wordmark}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 64 }}>
                <div style={{ width: 36, height: 3, borderRadius: 3, background: GOLD }} />
                <span style={{ fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,0.78)" }}>{clip(kicker, 60)}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  marginTop: 22,
                  fontFamily: "Albert Sans",
                  fontWeight: 800,
                  fontSize: titleSize(cleanTitle),
                  lineHeight: 1.04,
                  letterSpacing: -2,
                }}
              >
                {cleanTitle}
              </div>

              {subtitle && (
                <div style={{ display: "flex", marginTop: 24, fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.78)" }}>
                  {clip(subtitle, 70)}
                </div>
              )}

              <div style={{ display: "flex", marginTop: "auto", alignItems: "center", gap: 12, fontSize: 21, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                <div style={{ width: 10, height: 10, borderRadius: 10, background: GOLD }} />
                {host}
              </div>
            </div>

            <div style={{ position: "absolute", right: 64, top: 108, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 16 }}>
                <Tile hue={hue} kind="rings" size={164} />
                <Tile hue="k-gold" kind="bars" size={164} />
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <Tile hue="k-data" kind="dots" size={164} />
                <Tile hue={hue} kind="arch" size={164} />
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: fonts.length ? fonts : undefined,
          // Caching headers are set by the route, which also keeps the
          // rendered image (src/app/[lang]/og/[...slug]/route.tsx).
        }
      )
  );
}
