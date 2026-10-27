/**
 * Flat geometric illustrations, drawn in the current hue (`.k-*`) plus gold.
 *
 * Every motif lives on a 100×100 canvas so the same art works in a hero
 * mosaic tile, a bento tile, a chip swatch or a card icon. Colours come from
 * the hue levels via the fill/stroke helper classes in globals.css (f0…f900,
 * s0…s900, fg), so the art follows the theme without any JavaScript.
 */
import type { ArtName } from "@/lib/hues";

const r1 = (n: number) => Math.round(n * 10) / 10;

/** A cog with `teeth` teeth, as one path. */
function gearPath(cx: number, cy: number, rOuter: number, rInner: number, teeth: number) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  const polar = (r: number, a: number) => `${r1(cx + r * Math.cos(a))} ${r1(cy + r * Math.sin(a))}`;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    pts.push(polar(rInner, a - step * 0.3), polar(rOuter, a - step * 0.17), polar(rOuter, a + step * 0.17), polar(rInner, a + step * 0.3));
  }
  return `M${pts.join("L")}Z`;
}

/** A sine wave across the canvas as a polyline. */
function wavePath(y: number, amp: number, phase: number, width = 100, period = 52) {
  const pts: string[] = [];
  for (let x = 0; x <= width; x += 5) {
    pts.push(`${x} ${r1(y + amp * Math.sin(((x + phase) / period) * Math.PI * 2))}`);
  }
  return `M${pts.join("L")}`;
}

const GEAR = gearPath(50, 50, 36, 27, 9);
const WAVES = [wavePath(32, 6, 0), wavePath(52, 6.5, 14), wavePath(72, 6.5, 28)];

export function ArtMotif({ name }: { name: ArtName }) {
  switch (name) {
    case "code":
      return (
        <>
          <rect x="12" y="20" width="76" height="60" rx="12" className="f0" />
          <circle cx="24" cy="31" r="3" className="f300" />
          <circle cx="33" cy="31" r="3" className="fg" />
          <path d="M36 48 28 56 36 64M64 48 72 56 64 64" className="s700 rnd fnone" strokeWidth="5" />
          <path d="M54 45 46 67" className="s500 rnd" strokeWidth="5" />
        </>
      );
    case "dots": {
      const dots: React.ReactNode[] = [];
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++) {
          const big = (r + c) % 3 === 0;
          const gold = r === 1 && c === 2;
          dots.push(
            <circle
              key={`${r}-${c}`}
              cx={20 + c * 20}
              cy={20 + r * 20}
              r={big ? 6 : 4.5}
              className={gold ? "fg" : (r * 4 + c) % 2 ? "f500" : "f300"}
            />
          );
        }
      return <>{dots}</>;
    }
    case "target":
      return (
        <>
          <g className="spin">
            <circle cx="50" cy="50" r="38" className="s500 fnone" strokeWidth="6" strokeDasharray="44 16" />
          </g>
          <circle cx="50" cy="50" r="22" className="s300 fnone" strokeWidth="6" />
          <circle cx="50" cy="50" r="8" className="f700" />
        </>
      );
    case "book":
      return (
        <>
          <path d="M50 30C38 24 24 24 12 28v48c12-4 26-4 38 2Z" className="f0" />
          <path d="M50 30c12-6 26-6 38-2v48c-12-4-26-4-38 2Z" className="f300" />
          <path d="M50 30v48" className="s700" strokeWidth="2" />
          <path d="M70 26v18l5-4 5 4V25" className="fg" />
        </>
      );
    case "arch":
      return (
        <>
          <path d="M22 100V52a28 28 0 0 1 56 0v48Z" className="f0" />
          <path d="M36 100V60a14 14 0 0 1 28 0v40Z" className="f500" />
        </>
      );
    case "bars":
      return (
        <>
          <rect x="16" y="54" width="16" height="30" rx="6" className="f300" />
          <rect x="42" y="38" width="16" height="46" rx="6" className="f500" />
          <rect x="68" y="18" width="16" height="66" rx="6" className="f700" />
        </>
      );
    case "route":
      return (
        <>
          <path d="M16 80c24 0 20-56 46-56s22 36 22 36" className="s500 rnd fnone" strokeWidth="9" />
          <circle cx="16" cy="80" r="8" className="f0 s900" strokeWidth="3" />
          <circle cx="84" cy="62" r="8" className="fg" />
        </>
      );
    case "waves":
      return (
        <g className="drift">
          <path d={WAVES[0]} className="s300 rnd fnone" strokeWidth="6" />
          <path d={WAVES[1]} className="s500 rnd fnone" strokeWidth="6" />
          <path d={WAVES[2]} className="s700 rnd fnone" strokeWidth="6" />
        </g>
      );
    case "star":
      return <path d="M50 10c4 28 12 36 40 40-28 4-36 12-40 40-4-28-12-36-40-40 28-4 36-12 40-40Z" className="fn" />;
    case "stairs":
      return (
        <>
          <path d="M0 100V76h24V52h24V28h24V4h28v96Z" className="f500" />
          <circle cx="24" cy="30" r="9" className="fg" />
        </>
      );
    case "orbit":
      return (
        <>
          <circle cx="50" cy="50" r="30" className="f300" />
          <circle cx="50" cy="50" r="14" className="f0" />
        </>
      );
    case "blocks":
      return (
        <>
          <rect x="14" y="54" width="32" height="32" rx="8" className="f500" />
          <rect x="54" y="54" width="32" height="32" rx="8" className="f300" />
          <rect x="34" y="16" width="32" height="32" rx="8" className="f0" />
        </>
      );
    case "gear":
      return (
        <>
          <g className="spin">
            <path d={GEAR} className="f500" />
            <circle cx="50" cy="50" r="12" className="f100" />
          </g>
          <circle cx="50" cy="50" r="5" className="fg" />
        </>
      );
    case "bolt":
      return (
        <>
          <circle cx="50" cy="50" r="34" className="f0" />
          <path d="M55 16 30 55h17l-5 29 26-40H51Z" className="f500" />
          <circle cx="78" cy="24" r="6" className="fg" />
        </>
      );
    case "shield":
      return (
        <>
          <path d="M50 12 82 22v26c0 20-14 34-32 40-18-6-32-20-32-40V22Z" className="f500" />
          <path d="M34 42l16 14 16-14" className="s0 rnd fnone" strokeWidth="6" />
          <circle cx="50" cy="28" r="5" className="fg" />
        </>
      );
    case "chip":
      return (
        <>
          <path d="M38 22V12M50 22V12M62 22V12M38 88V78M50 88V78M62 88V78M22 38H12M22 50H12M22 62H12M88 38H78M88 50H78M88 62H78" className="s500 rnd" strokeWidth="4" />
          <rect x="22" y="22" width="56" height="56" rx="12" className="f0" />
          <rect x="38" y="38" width="24" height="24" rx="6" className="f700" />
          <circle cx="31" cy="31" r="3.5" className="fg" />
        </>
      );
  }
}

/** A standalone 100×100 illustration. */
export function TileArt({
  name,
  className,
  preserve = "xMidYMid meet",
}: {
  name: ArtName;
  className?: string;
  preserve?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio={preserve} className={className} aria-hidden="true" focusable="false">
      <ArtMotif name={name} />
    </svg>
  );
}

const GRID_D = (() => {
  const d: string[] = [];
  for (let x = 20; x < 320; x += 20) d.push(`M${x} 0V200`);
  for (let y = 20; y < 200; y += 20) d.push(`M0 ${y}H320`);
  return d.join("");
})();

const SIDE_KIND: Record<ArtName, "bars" | "line" | "pages" | "blocks"> = {
  code: "bars",
  dots: "bars",
  target: "bars",
  orbit: "bars",
  bars: "line",
  chip: "bars",
  route: "line",
  waves: "line",
  book: "pages",
  star: "pages",
  shield: "blocks",
  arch: "blocks",
  stairs: "blocks",
  blocks: "pages",
  gear: "bars",
  bolt: "line",
};

/**
 * A 16:10 cover: blueprint grid, the motif large on the left, a secondary
 * figure on the right and a dimension line carrying `label` (a real value —
 * the programme or subject code).
 */
export function CoverArt({ name, label, className }: { name: ArtName; label?: string; className?: string }) {
  const side = SIDE_KIND[name];
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <rect width="320" height="200" className="f100" />
      <path className="grid" d={GRID_D} />
      <circle cx="108" cy="104" r="92" className="f50" opacity=".7" />
      <g transform="translate(30 26) scale(1.55)">
        <ArtMotif name={name} />
      </g>
      {side === "bars" && (
        <g>
          <rect x="206" y="122" width="12" height="44" rx="6" className="f300" />
          <rect x="226" y="96" width="12" height="70" rx="6" className="f300" />
          <rect x="246" y="108" width="12" height="58" rx="6" className="f300" />
          <rect x="266" y="70" width="12" height="96" rx="6" className="f700" />
          <rect x="286" y="86" width="12" height="80" rx="6" className="f300" />
        </g>
      )}
      {side === "line" && (
        <g>
          <path d="M204 150c18-4 26-30 44-34s26 14 50-26" className="s700 rnd fnone" strokeWidth="5" />
          <circle cx="204" cy="150" r="6" className="f0 s700" strokeWidth="3" />
          <circle cx="298" cy="90" r="7" className="fg" />
        </g>
      )}
      {side === "pages" && (
        <g>
          <rect x="214" y="52" width="76" height="104" rx="10" className="f0" />
          <rect x="226" y="68" width="40" height="6" rx="3" className="f300" />
          <rect x="226" y="84" width="52" height="6" rx="3" className="f200" />
          <rect x="226" y="98" width="46" height="6" rx="3" className="f200" />
          <rect x="226" y="112" width="30" height="6" rx="3" className="f500" />
          <circle cx="274" cy="138" r="7" className="fg" />
        </g>
      )}
      {side === "blocks" && (
        <g>
          <rect x="214" y="104" width="34" height="34" rx="9" className="f500" />
          <rect x="256" y="104" width="34" height="34" rx="9" className="f300" />
          <rect x="235" y="62" width="34" height="34" rx="9" className="f0" />
          <circle cx="252" cy="79" r="5" className="fg" />
        </g>
      )}
      {label && (
        <>
          <path className="dimline" d="M202 186H298M202 181V191M298 181V191" />
          <text className="dim" x="250" y="178" textAnchor="middle">
            {label.length > 14 ? `${label.slice(0, 13)}…` : label}
          </text>
        </>
      )}
    </svg>
  );
}
