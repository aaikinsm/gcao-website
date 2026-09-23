export async function extractPdfText(bytes: Buffer) {
  try {
    const unpdf = await import("unpdf");
    const pdf = await unpdf.getDocumentProxy(new Uint8Array(bytes));
    const { text } = await unpdf.extractText(pdf, { mergePages: true });
    const joined = Array.isArray(text) ? text.join("\n") : String(text);
    if (joined.trim()) return joined.trim();
  } catch {
    // Fall through to a rough text scrape if the PDF helper is missing.
  }

  const raw = bytes.toString("latin1");
  const matches = [...raw.matchAll(/\(([^)]{6,})\)/g)].map((match) =>
    match[1].replace(/\\n/g, "\n").replace(/\\(.)/g, "$1"),
  );
  return matches.join(" ").replace(/\s+/g, " ").trim();
}
