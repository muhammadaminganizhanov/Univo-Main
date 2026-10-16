/** schema.org graph as JSON-LD. `<` is escaped so the payload can never close the script tag. */
export function JsonLd({ graph }: { graph: Record<string, unknown>[] }) {
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
