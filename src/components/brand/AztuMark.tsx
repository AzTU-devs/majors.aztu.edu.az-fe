import { BRAND_WORDMARK, UNIVERSITY, type Locale } from "@/lib/site";

/**
 * The AzTU shield mark.
 *
 * A vector trace of the official mark (public/brand/aztu-mark.png, 276×512):
 * straight edges measured from the PNG, curves fitted to its outline
 * (0.12–0.25 px RMS; 99.1% overlap with the PNG's shape). Inline, so it costs
 * no request, stays sharp at every size and takes its colour from CSS —
 * `--mark` is the official #1a2150 at the PNG's 85.5% opacity, white in dark
 * mode.
 */
export const AZTU_MARK_PATH =
  "M0 0L138 48L276 0V112H0ZM0 195H97V279.7C97 378.8 87.1 362.1 138 396.5C188.9 362.1 179 378.8 179 279.7V195H276V352.9C276 440.6 188.9 476.6 138 512C87.1 476.6 0 440.6 0 352.9Z";

export function AztuMark({
  className,
  title,
  color = "var(--mark)",
}: {
  className?: string;
  /** Accessible name; omit when the mark is decorative or labelled elsewhere. */
  title?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 276 512"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path d={AZTU_MARK_PATH} fill={color} />
    </svg>
  );
}

/** Shield + two-line wordmark ("AZTU" over the product name). */
export function BrandLockup({ locale, size = "md" }: { locale: Locale; size?: "md" | "lg" }) {
  return (
    <>
      <AztuMark className={size === "lg" ? "h-11 w-auto" : "h-[34px] w-auto"} />
      <span className="wm">
        <small>{UNIVERSITY.shortName.toUpperCase()}</small>
        <b className={size === "lg" ? "!text-[21px]" : undefined}>{BRAND_WORDMARK[locale]}</b>
      </span>
    </>
  );
}
