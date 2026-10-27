/**
 * Programme card data, shared by the server pages and the (client) catalogue.
 * Client-safe: no API access here.
 */
import { styleFromKey, type FacultyStyle } from "./hues";

export interface ProgrammeCardData {
  key: string;
  code: string;
  name: string;
  degree: 1 | 2;
  cafedra?: string | null;
  facultyCode?: string;
  facultyName?: string;
  hue: FacultyStyle["hue"];
  art: FacultyStyle["art"];
  createdAt?: string | null;
}

export interface ProgrammeSource {
  specialty_key: string;
  specialty_code: string;
  specialty_name: string;
  cafedra_name?: string | null;
  degree?: number;
  created_at?: string | null;
}

/** The style of a programme: its faculty's, else a stable one from its key. */
export function programmeStyle(
  key: string,
  facultyOf: Record<string, string>,
  styles: Record<string, FacultyStyle>
): FacultyStyle {
  const faculty = facultyOf[key];
  return (faculty && styles[faculty]) || styleFromKey(key);
}

export function makeCard(
  s: ProgrammeSource,
  facultyOf: Record<string, string>,
  styles: Record<string, FacultyStyle>,
  facultyNames: Record<string, string>
): ProgrammeCardData {
  const style = programmeStyle(s.specialty_key, facultyOf, styles);
  const facultyCode = facultyOf[s.specialty_key];
  return {
    key: s.specialty_key,
    code: (s.specialty_code ?? "").trim(),
    name: (s.specialty_name ?? "").replace(/\s+/g, " ").trim(),
    degree: s.degree === 2 ? 2 : 1,
    cafedra: s.cafedra_name ? s.cafedra_name.replace(/\s+/g, " ").trim() : null,
    facultyCode,
    facultyName: facultyCode ? facultyNames[facultyCode] : undefined,
    hue: style.hue,
    art: style.art,
    createdAt: s.created_at ?? null,
  };
}
