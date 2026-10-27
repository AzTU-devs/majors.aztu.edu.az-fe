/**
 * One illustration per faculty, for the large tiles (hero mosaic and band).
 *
 * Each scene shows what the faculty actually works on, drawn the way an
 * engineer would: one stroke weight, flat fills from the faculty hue (the f…
 * and s… helper classes in globals.css) plus a single gold accent, and the
 * small marks of a technical drawing — centre lines, pitch circles, a
 * dimension label. Every
 * scene sits on the same 100×100 canvas as TileArt, with a transparent
 * background so the tile colour shows through.
 */
import type { SceneName } from "@/lib/hues";

const r1 = (n: number) => Math.round(n * 100) / 100;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** A spur gear: `teeth` teeth between the root and tip radii, the first tooth centred at `rotDeg`. */
function gear(cx: number, cy: number, tip: number, root: number, teeth: number, rotDeg: number) {
  const step = (Math.PI * 2) / teeth;
  const at = (r: number, a: number) => `${r1(cx + r * Math.cos(a))} ${r1(cy + r * Math.sin(a))}`;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = rad(rotDeg) + i * step;
    pts.push(at(root, a - step * 0.32), at(tip, a - step * 0.16), at(tip, a + step * 0.16), at(root, a + step * 0.32));
  }
  return `M${pts.join("L")}Z`;
}

/** Point on a circle, for arcs. */
function polar(cx: number, cy: number, r: number, deg: number) {
  return `${r1(cx + r * Math.cos(rad(deg)))} ${r1(cy + r * Math.sin(rad(deg)))}`;
}

/* ── Gears (Maşınqayırma) ─────────────────────────────────────
   Meshing pair: the tooth of the big wheel on the line of centres meets a
   gap of the pinion. Circular pitch ≈ 10.1 for both, so the teeth match. */
const BIG = { cx: 39, cy: 61, pitch: 22.5, teeth: 14 };
const SMALL_PITCH = (BIG.pitch * 9) / BIG.teeth; // 14.46
const LINE_OF_CENTRES = -42;
const SMALL = {
  cx: BIG.cx + (BIG.pitch + SMALL_PITCH) * Math.cos(rad(LINE_OF_CENTRES)),
  cy: BIG.cy + (BIG.pitch + SMALL_PITCH) * Math.sin(rad(LINE_OF_CENTRES)),
};
// Wheel: a tooth on the line of centres. Pinion (9 teeth, 40° apart): a gap there.
const BIG_GEAR = gear(BIG.cx, BIG.cy, BIG.pitch + 2.6, BIG.pitch - 2.9, BIG.teeth, LINE_OF_CENTRES);
const SMALL_GEAR = gear(SMALL.cx, SMALL.cy, SMALL_PITCH + 2.6, SMALL_PITCH - 2.9, 9, LINE_OF_CENTRES + 180 - 20);
const LIGHTENING_HOLES = [45, 135, 225, 315].map((a) => [
  r1(BIG.cx + 12.6 * Math.cos(rad(a))),
  r1(BIG.cy + 12.6 * Math.sin(rad(a))),
]);

/* ── Pylon (Energetika) ───────────────────────────────────────
   Lattice legs from (34,88)→(46.5,22) and (66,88)→(53.5,22). */
const legX = (y: number, side: -1 | 1) => r1(50 + side * (16 - ((88 - y) * 12.5) / 66));
const STRUTS = [88, 76, 64, 54, 46, 38, 30];
const LATTICE = (() => {
  const d: string[] = [];
  for (let i = 0; i < STRUTS.length - 1; i++) {
    const [a, b] = [STRUTS[i], STRUTS[i + 1]];
    d.push(`M${legX(a, -1)} ${a}L${legX(b, 1)} ${b}M${legX(a, 1)} ${a}L${legX(b, -1)} ${b}`);
    if (i > 0) d.push(`M${legX(a, -1)} ${a}H${legX(a, 1)}`);
  }
  return d.join("");
})();

/* ── Telecom mast (İnformasiya texnologiyaları) ───────────── */
const mastX = (y: number, side: -1 | 1) => r1(39 + side * (6 - ((88 - y) * 4.5) / 66));
const MAST_ZIGZAG = (() => {
  const pts: string[] = [];
  let side: -1 | 1 = -1;
  for (let y = 88; y >= 24; y -= 8) {
    pts.push(`${mastX(y, side)} ${y}`);
    side = side === -1 ? 1 : -1;
  }
  return `M${pts.join("L")}`;
})();
const SIGNAL = [7, 12, 17].map((r) => `M${polar(39, 15, r, 178)}A${r} ${r} 0 0 1 ${polar(39, 15, r, 226)}`).join("");

/* ── Ruler ticks (fallback scene) ─────────────────────────── */
const RULER_TICKS = Array.from({ length: 19 }, (_, i) => {
  const x = 13 + i * 4;
  return `M${x} 72V${i % 5 === 0 ? 77.5 : 75}`;
}).join("");

function Scene({ name }: { name: SceneName }) {
  switch (name) {
    case "telecom":
      return (
        <g className="rnd">
          <path d="M6 88H94" className="s300 fnone" strokeWidth="1.4" />
          <path d={SIGNAL} className="s500 fnone" strokeWidth="1.6" />
          {/* lattice mast with aviation light */}
          <path d={`M${mastX(88, -1)} 88L${mastX(20, -1)} 20M${mastX(88, 1)} 88L${mastX(20, 1)} 20`} className="s900 fnone" strokeWidth="2.2" />
          <path d={MAST_ZIGZAG} className="s700 fnone" strokeWidth="1.1" />
          <path d="M39 20V11" className="s900 fnone" strokeWidth="1.4" />
          <circle cx="39" cy="9.6" r="1.7" className="fg" />
          <path d={`M34 24H${mastX(24, -1)}M34 29H${mastX(29, -1)}M44 24H${mastX(24, 1)}M44 29H${mastX(29, 1)}`} className="s900 fnone" strokeWidth="1" />
          <rect x="31.2" y="21" width="2.8" height="11" rx="1" className="f500" />
          <rect x="44" y="21" width="2.8" height="11" rx="1" className="f500" />
          {/* microwave dish beaming to the laptop */}
          <path d="M42 41.5H44.5" className="s900 fnone" strokeWidth="1.4" />
          <circle cx="48.6" cy="41.5" r="4.3" className="f0 s700" strokeWidth="1.2" />
          <path d="M53 43.4 66 56" className="s700 fnone" strokeWidth="0.9" strokeDasharray="2 2" />
          {/* laptop */}
          <rect x="58" y="56" width="32" height="22.5" rx="2.2" className="f700" />
          <rect x="60.8" y="58.8" width="26.4" height="17" rx="1" className="f900" />
          <path d="M68.5 63.5 65 67.3 68.5 71.1M79.5 63.5 83 67.3 79.5 71.1" className="s0 fnone" strokeWidth="1.5" />
          <path d="M75.6 62.6 72.4 72" className="sg fnone" strokeWidth="1.5" />
          <path d="M54.5 79H93.5L90.8 82.6H57.2Z" className="f900" />
          <text x="58" y="15" className="tag">1800 MHz</text>
        </g>
      );

    case "economics":
      return (
        <g className="rnd">
          <path d="M6 88H94" className="s300 fnone" strokeWidth="1.4" />
          {/* growth chart over the plant */}
          <path d="M10 40 24 34 38 37 52 26 66 19V48H10Z" className="f200" />
          <path d="M10 40 24 34 38 37 52 26 66 19" className="s900 fnone" strokeWidth="1.8" />
          {[
            [10, 40],
            [24, 34],
            [38, 37],
            [52, 26],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="1.9" className="f0 s900" strokeWidth="1.1" />
          ))}
          <circle cx="66" cy="19" r="2.8" className="fg" />
          <text x="49" y="13.5" className="tag">+12%</text>
          {/* saw-tooth roof plant */}
          <rect x="8" y="60" width="56" height="28" className="f700" />
          <path d="M8 60 22 50.5V60ZM22 60 36 50.5V60ZM36 60 50 50.5V60ZM50 60 64 50.5V60Z" className="f500" />
          <path d="M22 51.5V59M36 51.5V59M50 51.5V59M64 51.5V59" className="s0 fnone" strokeWidth="1" />
          {[12, 20, 28, 36, 44, 52].map((x) => (
            <rect key={x} x={x} y="66" width="4.6" height="7" rx="0.8" className="f300" />
          ))}
          <rect x="54" y="77" width="7" height="11" rx="0.8" className="f900" />
          {/* chimney with a gold band, and its smoke */}
          <rect x="70" y="36" width="8.4" height="52" rx="1" className="f900" />
          <rect x="70" y="42.5" width="8.4" height="2.2" className="fg" />
          <circle cx="80.5" cy="29.5" r="4" className="f300" />
          <circle cx="87" cy="23.5" r="3" className="f300" />
          <circle cx="91.5" cy="18" r="2.1" className="f300" />
        </g>
      );

    case "machine":
      return (
        <g className="rnd">
          {/* centre lines, as on a drawing */}
          <path
            d={`M${BIG.cx - 30} ${BIG.cy}H${BIG.cx + 30}M${BIG.cx} ${BIG.cy - 30}V${BIG.cy + 30}M${r1(SMALL.cx - 21)} ${r1(SMALL.cy)}H${r1(SMALL.cx + 21)}M${r1(SMALL.cx)} ${r1(SMALL.cy - 21)}V${r1(SMALL.cy + 21)}`}
            className="s700 fnone"
            strokeWidth="0.5"
            strokeDasharray="5 1.4 1 1.4"
          />
          <path d={BIG_GEAR} className="f700" />
          <circle cx={BIG.cx} cy={BIG.cy} r={BIG.pitch} className="s300 fnone" strokeWidth="0.7" strokeDasharray="1.6 1.6" />
          <circle cx={BIG.cx} cy={BIG.cy} r="8.2" className="f500" />
          {LIGHTENING_HOLES.map(([x, y]) => (
            <circle key={`${x}`} cx={x} cy={y} r="3.1" className="f100" />
          ))}
          <circle cx={BIG.cx} cy={BIG.cy} r="4.4" className="f100" />
          <rect x={BIG.cx - 1.2} y={BIG.cy - 5.9} width="2.4" height="2.2" className="f100" />
          <path d={SMALL_GEAR} className="f500" />
          <circle cx={r1(SMALL.cx)} cy={r1(SMALL.cy)} r={r1(SMALL_PITCH)} className="s0 fnone" strokeWidth="0.7" strokeDasharray="1.6 1.6" />
          <circle cx={r1(SMALL.cx)} cy={r1(SMALL.cy)} r="3.6" className="f100" />
          {/* rolled steel I-profile, dimensioned */}
          <path d="M73 77H93V80.4H84.5V86.6H93V90H73V86.6H81.5V80.4H73Z" className="fg" />
          <path d="M73 72.6H93M73 70.6V74.6M93 70.6V74.6" className="s700 fnone" strokeWidth="0.6" />
          <path d="M74.6 72.6 73 71.8V73.4ZM91.4 72.6 93 71.8V73.4Z" className="f700" />
          <text x="7" y="14" className="tag">z14 · z9</text>
        </g>
      );

    case "transport":
      return (
        <g className="rnd">
          {/* route with stops */}
          <path d="M10 33 34 25 58 31 80 24.5" className="s700 fnone" strokeWidth="1.1" strokeDasharray="2.4 2.2" />
          {[
            [10, 33],
            [34, 25],
            [58, 31],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="2.2" className="f0 s700" strokeWidth="1.2" />
          ))}
          <path d="M80 24.5c0 0-6.2-5.7-6.2-10.4a6.2 6.2 0 0 1 12.4 0c0 4.7-6.2 10.4-6.2 10.4Z" className="fg" />
          <circle cx="80" cy="14.2" r="2.2" className="f0" />
          <text x="25" y="17.5" className="tag">km 42</text>
          {/* container wagon */}
          <rect x="8" y="50" width="40" height="21" rx="1.5" className="f500" />
          <path d="M13 53.5V67.5M18 53.5V67.5M23 53.5V67.5M28 53.5V67.5M33 53.5V67.5M38 53.5V67.5M43 53.5V67.5" className="s700 fnone" strokeWidth="0.9" />
          <rect x="7" y="71" width="43" height="4" rx="1" className="f900" />
          {/* locomotive */}
          <rect x="60" y="44" width="14" height="4.5" rx="1" className="f500" />
          <path d="M54 48H80.5L90 57.5V72H54Z" className="f700" />
          <path d="M81 51.2 86.6 56.8H81Z" className="f0" />
          <rect x="58" y="52" width="7" height="5" rx="1" className="f300" />
          <rect x="68" y="52" width="7" height="5" rx="1" className="f300" />
          <rect x="54" y="63.2" width="36" height="2.6" className="fg" />
          <rect x="53" y="72" width="38" height="4" rx="1" className="f900" />
          <rect x="50" y="72.6" width="3" height="2" className="f900" />
          {[15, 42, 62, 82].map((x) => (
            <g key={x}>
              <circle cx={x} cy="78" r="4" className="f900" />
              <circle cx={x} cy="78" r="1.3" className="f0" />
            </g>
          ))}
          {/* track */}
          <path d="M0 82.4H100" className="s900 fnone" strokeWidth="1.8" />
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={i * 8 + 0.5} y="83.6" width="5" height="2.8" rx="0.6" className="f300" />
          ))}
        </g>
      );

    case "energy":
      return (
        <g className="rnd">
          <path d="M6 88H94" className="s300 fnone" strokeWidth="1.4" />
          {/* earth wire and phase conductors (catenaries through the insulator strings) */}
          <path d="M-2 18.5Q24 23 50 13.2Q76 23 102 18.5" className="s500 fnone" strokeWidth="0.8" />
          <path d="M-2 31Q11 40.5 23.5 37M76.5 37Q89 40.5 102 31M-2 49Q12 57.5 26.5 54.5M73.5 54.5Q88 57.5 102 49" className="s700 fnone" strokeWidth="1.1" />
          {/* lattice tower */}
          <path d={`M34 88L46.5 22L50 13.2L53.5 22L66 88`} className="s900 fnone" strokeWidth="2.3" />
          <path d={LATTICE} className="s700 fnone" strokeWidth="1" />
          {/* cross-arms */}
          <path d="M21.5 30H78.5M24.5 46H75.5" className="s900 fnone" strokeWidth="2.1" />
          <path d="M21.5 30 44.2 34.6M78.5 30 55.8 34.6M24.5 46 41.3 50.2M75.5 46 58.7 50.2" className="s700 fnone" strokeWidth="1" />
          {/* insulator strings */}
          <path d="M23.5 30V37M76.5 30V37M26.5 46V54.5M73.5 46V54.5" className="s700 fnone" strokeWidth="1.1" />
          {[
            [23.5, 32.4],
            [23.5, 34.6],
            [76.5, 32.4],
            [76.5, 34.6],
            [26.5, 48.6],
            [26.5, 50.8],
            [26.5, 53],
            [73.5, 48.6],
            [73.5, 50.8],
            [73.5, 53],
          ].map(([x, y]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="2.3" ry="0.85" className="f500" />
          ))}
          {/* danger sign */}
          <rect x="46.4" y="66.4" width="7.2" height="7.2" rx="1" transform="rotate(45 50 70)" className="fg" />
          <path d="M50.6 67.1 48.6 70.4H50.9L49.3 73" className="s900 fnone" strokeWidth="0.9" />
          <text x="7" y="13.5" className="tag">110 kV</text>
        </g>
      );

    case "institute":
      return (
        <g className="rnd">
          <rect x="16" y="48" width="68" height="30" className="f300" />
          {/* arched door and windows between the columns */}
          <path d="M44 78V66.5A6 6 0 0 1 56 66.5V78Z" className="f900" />
          <circle cx="53.6" cy="72" r="0.8" className="fg" />
          <rect x="25.6" y="55" width="5" height="9" rx="0.8" className="f500" />
          <rect x="69.4" y="55" width="5" height="9" rx="0.8" className="f500" />
          {/* four columns: base, shaft with fluting, capital */}
          {[21, 36, 64, 79].map((c) => (
            <g key={c}>
              <rect x={c - 3} y="48.5" width="6" height="28" className="f0" />
              <path d={`M${c - 1.2} 50.5V74.5M${c + 1.2} 50.5V74.5`} className="s200 fnone" strokeWidth="0.7" />
              <rect x={c - 4.3} y="46" width="8.6" height="2.6" rx="0.7" className="f0" />
              <rect x={c - 4} y="76" width="8" height="2" rx="0.5" className="f0" />
            </g>
          ))}
          {/* entablature and pediment */}
          <rect x="13.5" y="40" width="73" height="6" rx="1" className="f700" />
          <rect x="13.5" y="44.6" width="73" height="1.2" className="fg" />
          <path d="M11.5 40 50 18.5 88.5 40Z" className="f700" />
          <path d="M21 37.2 50 21.6 79 37.2Z" className="f500" />
          <circle cx="50" cy="31.2" r="3.4" className="fg" />
          <circle cx="50" cy="17.2" r="1.6" className="fg" />
          {/* steps */}
          <rect x="14" y="78" width="72" height="4" rx="0.8" className="f500" />
          <rect x="9.5" y="82" width="81" height="5" rx="1" className="f700" />
        </g>
      );

    case "special":
      return (
        <g className="rnd">
          {/* map: grid and contour lines */}
          <path d="M0 20H100M0 40H100M0 60H100M0 80H100M20 0V100M40 0V100M60 0V100M80 0V100" className="grid" />
          <path d="M8 80C7 67 22 59 35 64S52 82 39 88 9 92 8 80Z" className="s300 fnone" strokeWidth="1" />
          <path d="M16 79C16 71 25 67 32 70S41 80 34 83 17 85 16 79Z" className="s300 fnone" strokeWidth="1" />
          <path d="M23 78C23 75 27 73 30 74.5S33 79 30 80 23 80.5 23 78Z" className="f300" />
          <path d="M60 92C58 84 70 78 80 82S98 92 92 98" className="s300 fnone" strokeWidth="1" />
          <path d="M9 22C10 12 24 9 31 15S33 31 22 32 8 30 9 22Z" className="s300 fnone" strokeWidth="1" />
          {/* flight path with waypoints, then the target */}
          <path d="M6 94 26 72 50 78 55 63M74.8 34.5 80.6 25.9" className="s700 fnone" strokeWidth="1.1" strokeDasharray="2.4 2" />
          {[
            [26, 72],
            [50, 78],
          ].map(([x, y]) => (
            <rect key={x} x={x - 2} y={y - 2} width="4" height="4" transform={`rotate(45 ${x} ${y})`} className="f0 s700" strokeWidth="1" />
          ))}
          <text x="53.5" y="86.5" className="tag">WP2</text>
          <circle cx="84" cy="21" r="6" className="sg fnone" strokeWidth="1.4" />
          <circle cx="84" cy="21" r="1.7" className="fg" />
          <path d="M84 12V15.4M84 26.6V30M75 21H78.4M89.6 21H93" className="sg fnone" strokeWidth="1.3" />
          {/* UAV, top view: long straight wing, inverted V tail, pusher prop */}
          <g transform="translate(64 50) rotate(34.6)">
            <path d="M-24 -2.4-2-5.2H2L24-2.4V1.2L2 1H-2L-24 1.2Z" className="f700 s700" strokeWidth="0.8" />
            <path d="M0 11-7.6 16.6M0 11 7.6 16.6" className="s900 fnone" strokeWidth="2.3" />
            <rect x="-2.7" y="-18" width="5.4" height="32" rx="2.7" className="f900" />
            <path d="M-4.4 15.4H4.4" className="s500 fnone" strokeWidth="1.3" />
            <circle cx="0" cy="-13" r="1.5" className="fg" />
          </g>
          <text x="7" y="13.5" className="tag">ALT 1200</text>
        </g>
      );

    case "drafting":
    default:
      return (
        <g className="rnd">
          <rect x="10" y="70" width="80" height="11" rx="1.6" className="f300" />
          <path d={RULER_TICKS} className="s700 fnone" strokeWidth="0.8" />
          <path d="M63.4 67.6A28.4 28.4 0 0 0 49.2 41.9" className="sg fnone" strokeWidth="1.5" />
          <path d="M50 19 35 66.5M50 19 61.8 62" className="s900 fnone" strokeWidth="2.6" />
          <path d="M35 66.5 34.2 69.5" className="s900 fnone" strokeWidth="1.2" />
          <path d="M61.8 62 63.4 67.6 60.2 64.2Z" className="fg" />
          <rect x="48.8" y="7.5" width="2.4" height="9" rx="1.2" className="f900" />
          <circle cx="50" cy="19" r="3.4" className="f900" />
          <circle cx="50" cy="19" r="1.2" className="f0" />
          <text x="66" y="40" className="tag">R 28</text>
        </g>
      );
  }
}

export function FacultyScene({
  scene,
  className,
  preserve = "xMidYMid meet",
}: {
  scene: SceneName;
  className?: string;
  preserve?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio={preserve} className={className} aria-hidden="true" focusable="false">
      <Scene name={scene} />
    </svg>
  );
}
