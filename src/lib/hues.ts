/**
 * Colour and illustration for each faculty.
 *
 * Every faculty gets one hue of the design system (globals.css `.k-*`) and a
 * matching illustration, chosen from its name (az or en) and kept distinct
 * from the other faculties'. Programmes, departments and subjects inherit the
 * hue of their faculty, so a programme looks the same on the home page, in
 * the catalogue and on its own page.
 */

export type Hue =
  | "k-it"
  | "k-data"
  | "k-eng"
  | "k-biz"
  | "k-res"
  | "k-build"
  | "k-trans"
  | "k-energy"
  | "k-navy"
  | "k-gold";

export type ArtName =
  | "code"
  | "dots"
  | "target"
  | "book"
  | "arch"
  | "bars"
  | "route"
  | "waves"
  | "star"
  | "stairs"
  | "orbit"
  | "blocks"
  | "gear"
  | "bolt"
  | "shield"
  | "chip";

export interface FacultyStyle {
  hue: Hue;
  art: ArtName;
}

/** Faculty subject → hue + art. First match wins. */
const RULES: { test: RegExp; hue: Hue; art: ArtName }[] = [
  { test: /informasiya|telekommunikasiya|kompüter|information|telecom|computer|digital|rəqəmsal/i, hue: "k-it", art: "code" },
  { test: /energetika|energy|elektrik|electric|power/i, hue: "k-energy", art: "waves" },
  { test: /nəqliyyat|logistika|transport|logistic/i, hue: "k-trans", art: "route" },
  { test: /maşınqayırma|metallurgiya|mechanical|metallurg|machine/i, hue: "k-eng", art: "gear" },
  { test: /iqtisad|menecment|idarəetmə|econom|manage|business/i, hue: "k-biz", art: "bars" },
  { test: /xüsusi|special|defen|hərbi/i, hue: "k-build", art: "shield" },
  { test: /tikinti|memarlıq|construct|architect/i, hue: "k-build", art: "arch" },
  { test: /radio|elektron|electron/i, hue: "k-data", art: "chip" },
  { test: /institut|institute|təhsil|education|tədqiqat|research|humanit|fundamental/i, hue: "k-res", art: "book" },
];

/** Order used when a faculty matches no rule, or its hue is already taken. */
const FALLBACK_HUES: Hue[] = ["k-it", "k-data", "k-eng", "k-biz", "k-res", "k-build", "k-trans", "k-energy"];

export const DEFAULT_ART: Record<Hue, ArtName> = {
  "k-it": "code",
  "k-data": "dots",
  "k-eng": "gear",
  "k-biz": "bars",
  "k-res": "book",
  "k-build": "arch",
  "k-trans": "route",
  "k-energy": "waves",
  "k-navy": "shield",
  "k-gold": "star",
};

/**
 * Styles for a list of faculties (in API order). Pass the names in every
 * language you have so the keyword rules work on either.
 */
export function facultyStyles(
  faculties: { faculty_code: string; names: string[] }[]
): Record<string, FacultyStyle> {
  const out: Record<string, FacultyStyle> = {};
  const used = new Set<Hue>();
  const pending: string[] = [];

  for (const f of faculties) {
    const text = f.names.join(" ");
    const rule = RULES.find((r) => r.test.test(text));
    if (rule && !used.has(rule.hue)) {
      out[f.faculty_code] = { hue: rule.hue, art: rule.art };
      used.add(rule.hue);
    } else {
      pending.push(f.faculty_code);
      if (rule) out[f.faculty_code] = { hue: rule.hue, art: rule.art }; // hue replaced below
    }
  }

  for (const code of pending) {
    const free = FALLBACK_HUES.find((h) => !used.has(h));
    const hue = free ?? FALLBACK_HUES[hashString(code) % FALLBACK_HUES.length];
    used.add(hue);
    out[code] = { hue, art: out[code]?.art ?? DEFAULT_ART[hue] };
  }
  return out;
}

export function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A stable style for something whose faculty is unknown. */
export function styleFromKey(key: string): FacultyStyle {
  const hue = FALLBACK_HUES[hashString(key) % FALLBACK_HUES.length];
  return { hue, art: DEFAULT_ART[hue] };
}

/** Degree level colours: bachelor = navy family, master = gold family. */
export const DEGREE_HUE: Record<1 | 2, Hue> = { 1: "k-navy", 2: "k-gold" };
