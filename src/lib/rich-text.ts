const ALLOWED = new Set(["p", "br", "strong", "b", "em", "i", "u", "ul", "li"]);

export const RICH_TEXT_EDITOR_CLASS =
  "space-y-3 [&_p]:m-0 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:m-0";

function escapeText(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function decodeBasic(text: string) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function looksLikeHtml(text: string) {
  return /<\/?(p|br|strong|b|em|i|u|ul|ol|li|div)\b/i.test(text);
}

export function richTextPlain(html: string) {
  return sanitizeRichText(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function richTextIsEmpty(html: string) {
  return richTextPlain(html).length === 0;
}

export function sanitizeRichText(dirty: string) {
  if (!dirty.trim()) return "";

  const stripped = dirty
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  const parts: string[] = [];
  const stack: string[] = [];
  const token = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>|[^<]+/g;

  for (const match of stripped.matchAll(token)) {
    const raw = match[0];
    if (!raw.startsWith("<")) {
      parts.push(escapeText(decodeBasic(raw)));
      continue;
    }

    let tag = match[1].toLowerCase();
    if (tag === "div" || tag === "ol") tag = tag === "ol" ? "ul" : "p";
    if (!ALLOWED.has(tag)) continue;

    const isClose = raw.startsWith("</");
    if (tag === "br") {
      if (!isClose) parts.push("<br>");
      continue;
    }

    if (isClose) {
      const index = stack.lastIndexOf(tag);
      if (index === -1) continue;
      while (stack.length > index) {
        parts.push(`</${stack.pop()}>`);
      }
      continue;
    }

    stack.push(tag);
    parts.push(`<${tag}>`);
  }

  while (stack.length) {
    parts.push(`</${stack.pop()}>`);
  }

  return parts.join("").trim();
}

function inlineMarkdown(text: string) {
  const escaped = escapeText(text);
  return escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

export function markdownToHtml(text: string) {
  const blocks = text.split(/\n\n+/).map((block) => block.trim()).filter(Boolean);
  const html: string[] = [];

  for (const block of blocks) {
    const lines = block.split("\n");
    let bullets: string[] = [];

    const flush = () => {
      if (!bullets.length) return;
      html.push(`<ul>${bullets.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
      bullets = [];
    };

    for (const line of lines) {
      const bullet = line.match(/^-\s+(.*)$/);
      if (bullet) {
        bullets.push(bullet[1]);
        continue;
      }
      flush();
      if (line.trim()) html.push(`<p>${inlineMarkdown(line)}</p>`);
    }
    flush();
  }

  return html.join("");
}

export function toEditorHtml(text: string) {
  if (!text.trim()) return "";
  if (looksLikeHtml(text)) return sanitizeRichText(text);
  return sanitizeRichText(markdownToHtml(text));
}
