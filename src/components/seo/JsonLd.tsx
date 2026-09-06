/**
 * Emits a JSON-LD block. Server component — the markup is in the initial HTML,
 * which is what crawlers read.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped below so a stray "</script>" inside a
      // programme name can never break out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
