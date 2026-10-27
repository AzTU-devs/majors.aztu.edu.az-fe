import { AztuMark } from "@/components/brand/AztuMark";
import { TileArt } from "@/components/art/TileArt";
import type { ArtName, Hue } from "@/lib/hues";
import { cx } from "@/components/ui/primitives";

type Tile = { hue: Hue; art: ArtName; shape?: "round" | "arch" | "leaf" | "gold" };

/** Tiles around the shield, in grid order (the shield occupies the 2×2 centre). */
const TILES: Tile[] = [
  { hue: "k-it", art: "code" },
  { hue: "k-data", art: "dots", shape: "round" },
  { hue: "k-eng", art: "target" },
  { hue: "k-res", art: "book", shape: "arch" },
  { hue: "k-build", art: "arch" },
  // shield
  { hue: "k-biz", art: "bars" },
  { hue: "k-trans", art: "route", shape: "round" },
  { hue: "k-energy", art: "waves" },
  { hue: "k-gold", art: "star", shape: "gold" },
  { hue: "k-build", art: "stairs" },
  { hue: "k-it", art: "orbit", shape: "round" },
  { hue: "k-data", art: "blocks" },
];

function MoTile({ tile, i }: { tile: Tile; i: number }) {
  return (
    <div className={cx("mo mo-in", tile.hue, tile.shape)} style={{ "--i": i } as React.CSSProperties}>
      <TileArt name={tile.art} />
    </div>
  );
}

function ShieldTile({ i, animate = true }: { i: number; animate?: boolean }) {
  return (
    <div className={cx("mo big shield", animate && "mo-in")} style={{ "--i": i } as React.CSSProperties}>
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

/** The 4×4 hero mosaic (desktop). Purely decorative. */
export function HeroMosaic() {
  return (
    <div className="mosaic" aria-hidden="true">
      {TILES.slice(0, 5).map((t, i) => (
        <MoTile key={i} tile={t} i={i} />
      ))}
      <ShieldTile i={5} />
      {TILES.slice(5).map((t, i) => (
        <MoTile key={i + 5} tile={t} i={i + 6} />
      ))}
    </div>
  );
}

/** A slowly drifting two-row strip of the same tiles (phones and tablets). */
export function HeroBand() {
  const strip = (copy: number) => (
    <>
      <ShieldTile i={0} animate={false} />
      {TILES.map((t, i) => (
        <div key={`${copy}-${i}`} className={cx("mo", t.hue, t.shape)}>
          <TileArt name={t.art} />
        </div>
      ))}
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
