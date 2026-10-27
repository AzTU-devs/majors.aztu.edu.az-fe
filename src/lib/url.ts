/**
 * Sanitise a link that comes from admin-entered catalogue data (topic
 * resources, reading-list URLs) before it is rendered as an `href`.
 *
 * Only http(s) URLs are returned. `javascript:`, `data:`, `vbscript:` and
 * anything unparsable yield undefined, so the caller renders plain text
 * instead of a link. A bare host such as "www.example.com/book" — previously
 * resolved as a broken *relative* link on this site — is upgraded to https.
 */
export function safeExternalUrl(raw: string | null | undefined): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;

  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(value)
    ? value
    : /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/?#:]|$)/i.test(value)
    ? `https://${value}`
    : null;
  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}
