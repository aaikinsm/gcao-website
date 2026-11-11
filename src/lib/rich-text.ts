const FORMATTED = new Set(["p", "br", "strong", "b", "em", "i", "u", "ul", "li", "a"]);
const WIDE = new Set([
  ...FORMATTED,
  "h2",
  "h3",
  "ol",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "blockquote",
  "iframe",
]);

export const RICH_TEXT_EDITOR_CLASS =
  "space-y-3 [&_p]:m-0 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:m-0 [&_a]:font-semibold [&_a]:underline";

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
  return /<\/?(p|br|strong|b|em|i|u|ul|ol|li|div|a|h2|h3|table|img|iframe|blockquote)\b/i.test(text);
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

function safeHref(raw: string, wide: boolean) {
  const href = raw.match(/\bhref\s*=\s*"([^"]+)"/i)?.[1]?.trim() ?? "";
  if (!href || href.includes("\\")) return null;
  if (href.startsWith("/") && !href.startsWith("//")) {
    if (!wide && !href.startsWith("/publications/")) return null;
    return href;
  }
  if (!wide) return null;
  if (/^https?:\/\//i.test(href)) return href;
  if (/^mailto:[^\s"]+$/i.test(href)) return href;
  return null;
}

export function sanitizeRichText(dirty: string, wide = false) {
  if (!dirty.trim()) return "";
  const allowed = wide ? WIDE : FORMATTED;

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
    if (tag === "div") tag = "p";
    if (!wide && tag === "ol") tag = "ul";
    if (!allowed.has(tag)) continue;

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

    if (tag === "a") {
      const href = safeHref(raw, wide);
      if (!href) continue;
      stack.push("a");
      parts.push(`<a href="${href}">`);
      continue;
    }

    if (wide && tag === "img") {
      const src = raw.match(/\bsrc\s*=\s*"(\/(?:images|publications)\/[^"]+)"/i)?.[1];
      if (!src || src.includes("..") || src.includes("//") || src.includes("\\")) continue;
      parts.push(`<img src="${src}" alt="">`);
      continue;
    }

    if (wide && tag === "iframe") {
      const id = raw.match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})/i)?.[1];
      if (!id) continue;
      parts.push(
        `<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" allowfullscreen></iframe>`,
      );
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

export function sanitizeAdminHtml(text: string) {
  return sanitizeRichText(text, true);
}
