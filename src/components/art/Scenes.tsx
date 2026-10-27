/**
 * Larger illustrations for the home page. Flat shapes in the current hue
 * plus gold, like the tile art; skeleton bars stand in for text so the
 * pictures never show invented figures.
 */
import { AztuMark } from "@/components/brand/AztuMark";

/** Bachelor's card: four study years as columns of course blocks, a progress rail and a cap. */
export function BachelorArt({ className }: { className?: string }) {
  const cols = [0, 1, 2, 3];
  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden="true" focusable="false">
      <circle cx="268" cy="34" r="118" className="f200" opacity=".55" />
      <rect x="36" y="40" width="248" height="150" rx="24" className="f0" />
      {cols.map((c) => (
        <g key={c} transform={`translate(${60 + c * 54} 62)`}>
          <rect width="38" height="10" rx="5" className="f300" />
          <rect y="20" width="38" height="22" rx="7" className={c === 3 ? "f500" : "f200"} />
          <rect y="50" width="38" height="22" rx="7" className="f200" />
          <rect y="80" width="38" height="22" rx="7" className={c % 2 ? "f300" : "f200"} />
        </g>
      ))}
      <rect x="60" y="174" width="200" height="6" rx="3" className="f200" />
      <rect x="60" y="174" width="148" height="6" rx="3" className="f700" />
      <circle cx="208" cy="177" r="9" className="fg" />
      <g transform="translate(240 10)">
        <circle cx="30" cy="30" r="30" className="fn" />
        <path d="M30 17 12 26l18 9 18-9-18-9Z" fill="#fff" />
        <path d="M19 30v8c0 3 5 6 11 6s11-3 11-6v-8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </g>
      <rect x="64" y="206" width="92" height="22" rx="11" className="f0" />
      <circle cx="78" cy="217" r="4" className="f500" />
      <rect x="88" y="214" width="56" height="6" rx="3" className="f300" />
      <rect x="166" y="206" width="104" height="22" rx="11" className="f0" />
      <circle cx="180" cy="217" r="4" className="f500" />
      <rect x="190" y="214" width="68" height="6" rx="3" className="f300" />
    </svg>
  );
}

/** Master's card: a research document with a chart, and a magnifier. */
export function MasterArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden="true" focusable="false">
      <circle cx="268" cy="30" r="120" className="f200" opacity=".6" />
      <rect x="60" y="28" width="196" height="176" rx="24" className="f0" />
      <rect x="60" y="28" width="196" height="40" rx="24" className="f300" />
      <rect x="60" y="52" width="196" height="16" className="f300" />
      <circle cx="84" cy="48" r="5" className="f0" />
      <circle cx="232" cy="48" r="5" className="f0" />
      <rect x="84" y="88" width="104" height="8" rx="4" className="f300" />
      <rect x="84" y="104" width="148" height="8" rx="4" className="f200" />
      <rect x="84" y="120" width="128" height="8" rx="4" className="f200" />
      <rect x="84" y="150" width="14" height="30" rx="4" className="f300" />
      <rect x="106" y="138" width="14" height="42" rx="4" className="f500" />
      <rect x="128" y="158" width="14" height="22" rx="4" className="f300" />
      <rect x="150" y="130" width="14" height="50" rx="4" className="fn" />
      <g transform="translate(206 128)">
        <circle cx="34" cy="34" r="30" className="f0" />
        <circle cx="34" cy="34" r="30" fill="none" className="sg" strokeWidth="6" />
        <path d="M56 56 72 72" className="sg rnd" strokeWidth="9" />
        <path d="M22 38 30 30l8 6 10-12" fill="none" className="sn rnd" strokeWidth="4" />
      </g>
    </svg>
  );
}

/** Step 1: a search field with filter chips. `term` is a real programme name when known. */
export function StepSearchArt({ term, locale }: { term: string; locale: "az" | "en" }) {
  const az = locale === "az";
  return (
    <div aria-hidden className="flex h-full flex-col justify-center gap-4 p-6">
      <div className="flex h-12 items-center gap-3 rounded-full bg-paper px-4 ring-line-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="text-ink-3">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="truncate text-[15px] font-medium text-ink">{term}</span>
        <span className="h-5 w-[2px] shrink-0 animate-pulse bg-navy" />
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="k-navy pill pill-k">{az ? "Bakalavr" : "Bachelor's"}</span>
        <span className="pill pill-line">{az ? "Magistr" : "Master's"}</span>
        <span className="pill pill-line">{az ? "Fakültə" : "Faculty"}</span>
      </div>
    </div>
  );
}

/** Step 2: curriculum rows (code, name bar, credits bar). */
export function StepCurriculumArt() {
  return (
    <div aria-hidden className="k-it flex h-full flex-col justify-center gap-2.5 p-6">
      {[0.82, 0.64, 0.74].map((w, i) => (
        <div key={i} className="flex items-center gap-3 rounded-[14px] bg-paper p-2.5 ring-line">
          <span className="grid h-8 w-12 place-items-center rounded-[10px] bg-k-100">
            <span className="h-1.5 w-6 rounded bg-k-500" />
          </span>
          <span className="h-2 rounded bg-line-2" style={{ width: `${w * 60}%` }} />
          <span className="ml-auto h-6 w-9 rounded-full bg-k-100" />
        </div>
      ))}
    </div>
  );
}

/** Step 3: outcomes checklist with a progress rail. */
export function StepOutcomesArt() {
  return (
    <div aria-hidden className="k-build flex h-full flex-col justify-center gap-3 p-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <span className={`grid h-6 w-6 place-items-center rounded-full ${i < 2 ? "bg-k-500 text-white" : "bg-surface ring-line-2"}`}>
            {i < 2 && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12.5 4.2 4.2L19 7" />
              </svg>
            )}
          </span>
          <span className={`h-2 rounded ${i < 2 ? "bg-line" : "bg-line-2"}`} style={{ width: `${[58, 46, 64][i]}%` }} />
        </div>
      ))}
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-k-100">
        <div className="h-full w-2/3 rounded-full bg-k-500" />
      </div>
    </div>
  );
}

/**
 * The syllabus sheet in the showcase: the real structure of a syllabus page
 * (header, general information, topic plan, outcomes, reading list), with
 * bars in place of text and a "sample" stamp.
 */
export function SyllabusSheet({ locale }: { locale: "az" | "en" }) {
  const az = locale === "az";
  const rows = az
    ? ["Fənn kodu", "Kredit", "Semestr", "Tədris dili"]
    : ["Subject code", "Credits", "Semester", "Language"];
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute inset-x-6 -bottom-3 top-6 rotate-[2.5deg] rounded-[22px] bg-surface/70 ring-line" />
      <div className="relative rounded-[22px] bg-surface p-6 elev-3 ring-line sm:p-8">
        <div className="flex items-center gap-3 border-b border-line pb-5">
          <AztuMark className="h-9 w-auto" />
          <div className="leading-tight">
            <p className="text-[10px] font-bold tracking-[0.22em] text-gold-ink">AZTU</p>
            <p className="font-display text-[13px] font-bold text-ink">
              {az ? "Azərbaycan Texniki Universiteti" : "Azerbaijan Technical University"}
            </p>
          </div>
          <span className="ml-auto font-display text-[22px] font-extrabold tracking-[0.12em] text-navy sm:text-[26px]">
            {az ? "SİLLABUS" : "SYLLABUS"}
          </span>
        </div>

        <div className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r} className="flex items-center justify-between gap-3 rounded-[12px] bg-surface-2 px-3.5 py-2.5">
              <span className="text-[12.5px] font-medium text-ink-3">{r}</span>
              <span className="h-2 w-14 rounded bg-line-2" />
            </div>
          ))}
        </div>

        <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-3">
          {az ? "Mövzu planı" : "Topic plan"}
        </p>
        <ol className="mt-3 space-y-2">
          {[0.7, 0.55, 0.62].map((w, i) => (
            <li key={i} className="k-it flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-k-100 font-mono text-[11.5px] font-semibold text-k-700">
                {i + 1}
              </span>
              <span className="h-2 rounded bg-line" style={{ width: `${w * 100}%` }} />
            </li>
          ))}
        </ol>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[az ? "CLO" : "CLO", az ? "Ədəbiyyat" : "Reading", az ? "Qiymət" : "Grading"].map((label, i) => (
            <div key={label} className={`rounded-[14px] p-3 ${["k-data", "k-res", "k-biz"][i]} bg-k-100`}>
              <span className="block text-[11.5px] font-semibold text-k-900">{label}</span>
              <span className="mt-2 block h-1.5 w-3/4 rounded bg-k-300" />
              <span className="mt-1.5 block h-1.5 w-1/2 rounded bg-k-300" />
            </div>
          ))}
        </div>

        <span className="absolute -right-2 top-1/2 rotate-[-12deg] rounded-[10px] border-2 border-danger/70 px-3 py-1 font-display text-[15px] font-extrabold tracking-[0.18em] text-danger/80 sm:right-6">
          {az ? "NÜMUNƏ" : "SAMPLE"}
        </span>
      </div>
    </div>
  );
}
