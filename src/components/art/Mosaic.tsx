import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { AztuMark } from "@/components/brand/AztuMark";
import { FacultyScene } from "@/components/art/FacultyScenes";
import { TileArt } from "@/components/art/TileArt";
import { cx } from "@/components/ui/primitives";
import type { Hue, SceneName } from "@/lib/hues";
import { facultyPath } from "@/lib/routes";
import type { Locale } from "@/lib/site";

export interface MosaicFaculty {
  code: string;
  name: string;
  hue: Hue;
  scene: SceneName;
}

/*
  A cross of faculty tiles around the shield on a 4×4 grid:

        .   s0  s4   .
        s3  [shield] s1
        s6  [shield] s5
        .   s2  [newest card]

  Consecutive faculties are spread across the cross so neighbouring tiles
  differ in hue. The corners stay empty; the bottom-right one holds the
  newest-programme card, so it covers no tile.
*/
const SLOT_AREAS = ["1 / 2", "2 / 4", "4 / 2", "2 / 1", "1 / 3", "3 / 4", "3 / 1"];
const SHIELD_AREA = "2 / 2 / 4 / 4";
const ASIDE_AREA = "4 / 3 / 5 / 5";

/** Stand-ins while the faculty list is unavailable, so the hero never looks empty. */
const PLACEHOLDERS: { hue: Hue; scene: SceneName }[] = [
  { hue: "k-it", scene: "telecom" },
  { hue: "k-biz", scene: "economics" },
  { hue: "k-eng", scene: "machine" },
  { hue: "k-trans", scene: "transport" },
  { hue: "k-energy", scene: "energy" },
  { hue: "k-res", scene: "institute" },
  { hue: "k-build", scene: "special" },
];

function slotStyle(area: string, i: number): CSSProperties {
  return { gridArea: area, "--i": i } as CSSProperties;
}

function ShieldTile({ style, animate = true }: { style?: CSSProperties; animate?: boolean }) {
  return (
    <div className={cx("mo big shield", animate && "mo-in")} style={style} aria-hidden="true">
      <span className="ring" />
      <span className="ring2" />
      <span className="tick" style={{ left: "50%", top: "5%", width: 2, height: "6%", marginLeft: -1 }} />
      <span className="tick" style={{ left: "50%", bottom: "5%", width: 2, height: "6%", marginLeft: -1 }} />
      <span className="tick" style={{ top: "50%", left: "5%", height: 2, width: "6%", marginTop: -1 }} />
      <span className="tick" style={{ top: "50%", right: "5%", height: 2, width: "6%", marginTop: -1 }} />
      <AztuMark className="relative h-[38%] w-auto" color="rgb(255 255 255 / 0.92)" />
    </div>
  );
}

/** The hero mosaic (desktop): each tile pictures one faculty and opens it. */
export function HeroMosaic({
  locale,
  faculties,
  aside,
}: {
  locale: Locale;
  faculties: MosaicFaculty[];
  aside?: ReactNode;
}) {
  const shown = faculties.slice(0, SLOT_AREAS.length);
  const fillers = PLACEHOLDERS.filter((p) => !shown.some((f) => f.scene === p.scene)).slice(
    0,
    SLOT_AREAS.length - shown.length
  );
  return (
    <div className="mosaic">
      {shown.map((f, i) => (
        <Link
          key={f.code}
          href={facultyPath(locale, f.code)}
          className={cx("mo mo-in mo-fac", f.hue)}
          style={slotStyle(SLOT_AREAS[i], i)}
          aria-label={f.name}
        >
          <FacultyScene scene={f.scene} />
          <span className="mo-label" aria-hidden="true">
            {f.name}
          </span>
        </Link>
      ))}
      {fillers.map((p, j) => {
        const i = shown.length + j;
        return (
          <div key={p.scene} className={cx("mo mo-in", p.hue)} style={slotStyle(SLOT_AREAS[i], i)} aria-hidden="true">
            <FacultyScene scene={p.scene} />
          </div>
        );
      })}
      <ShieldTile style={slotStyle(SHIELD_AREA, SLOT_AREAS.length)} />
      {aside && (
        <div className="mosaic-aside" style={{ gridArea: ASIDE_AREA }}>
          {aside}
        </div>
      )}
    </div>
  );
}

/** A slowly drifting two-row strip of the same tiles (phones and tablets). Decorative. */
export function HeroBand({ faculties }: { faculties: MosaicFaculty[] }) {
  const tiles: { key: string; hue: Hue; scene: SceneName }[] = faculties.length
    ? faculties.map((f) => ({ key: f.code, hue: f.hue, scene: f.scene }))
    : PLACEHOLDERS.map((p) => ({ key: p.scene, ...p }));
  const strip = (copy: number) => (
    <>
      <ShieldTile animate={false} />
      {tiles.map((t) => (
        <div key={`${copy}-${t.key}`} className={cx("mo", t.hue)}>
          <FacultyScene scene={t.scene} />
        </div>
      ))}
      {/* An odd tile count would leave a gap before the next shield. */}
      {tiles.length % 2 === 1 && (
        <div className="mo gold k-gold">
          <TileArt name="star" />
        </div>
      )}
    </>
  );
  return (
    <div className="band-wrap" aria-hidden="true">
      <div className="band">
        {strip(0)}
        {strip(1)}
      </div>
    </div>
  );
}
