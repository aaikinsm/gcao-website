import { execFile } from "node:child_process";
import { readFileSync } from "node:fs";
import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
import mysql from "mysql2/promise";
import { richTextPlain, sanitizeAdminHtml, sanitizeRichText } from "../src/lib/rich-text.ts";
import { slugify } from "../src/lib/slug.ts";

const exec = promisify(execFile);
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
const ROOT = process.cwd();
const UPLOADS = resolve(ROOT, "public/images/uploads");
const write = process.argv.includes("--write");

const MONTHS = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

function loadEnvLocal() {
  const text = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&[a-z]+;/gi, " ");
}

function plainTitle(raw) {
  return decodeEntities(raw.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseBlogDate(text) {
  const match = text.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!match) return null;
  const month = MONTHS[match[2].slice(0, 3).toLowerCase()];
  const day = Number(match[1]);
  const year = Number(match[3]);
  if (!month || day < 1 || day > 31) return null;
  const sql = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} 12:00:00`;
  return { year, sql };
}

function groupFor(title) {
  const value = title.toLowerCase();
  if (/\bwomen(?:'s|’s)?\b/.test(value)) return "Women's";
  if (/\bmen(?:'s|’s)\b/.test(value)) return "Men's";
  if (/\byouth\b|\bhomework club\b/.test(value)) return "Youth";
  if (/\bseniors?\b/.test(value)) return "Welfare";
  return "";
}

function authorFor(title) {
  const match = title.match(/\bby\s+([A-Z][\p{L}'’.]+(?:\s+[A-Z][\p{L}'’.]+){1,3})\s*$/iu);
  return match ? match[1].replace(/[.’']+$/u, "") : null;
}

function decodeTypography(html) {
  const named = {
    rsquo: "’",
    lsquo: "‘",
    rdquo: "”",
    ldquo: "“",
    ndash: "–",
    mdash: "—",
    hellip: "…",
    apos: "'",
  };
  return html
    .replace(/&#(\d+);/g, (all, n) => {
      const code = Number(n);
      if (code === 38 || code === 60 || code === 62) return all;
      return String.fromCodePoint(code);
    })
    .replace(/&#x([0-9a-f]+);/gi, (all, n) => {
      const code = parseInt(n, 16);
      if (code === 38 || code === 60 || code === 62) return all;
      return String.fromCodePoint(code);
    })
    .replace(/&nbsp;/gi, " ")
    .replace(/&(rsquo|lsquo|rdquo|ldquo|ndash|mdash|hellip|apos);/gi, (_, name) => named[name.toLowerCase()]);
}

function excerptFrom(html, title) {
  const normTitle = normalizeTitle(title);
  const blocks = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)];
  for (const block of blocks) {
    const text = decodeEntities(block[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (!text || normalizeTitle(text) === normTitle) continue;
    if (/^i am text block\b/i.test(text)) continue;
    if (text.length <= 200) return text;
    const cut = text.slice(0, 200);
    const space = cut.lastIndexOf(" ");
    return `${(space > 140 ? cut.slice(0, space) : cut).trim()}…`;
  }
  return "";
}

function innerDiv(html, className) {
  const open = new RegExp(`<div\\b[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>`, "i").exec(html);
  if (!open) return "";
  let depth = 1;
  const tags = /<\/?div\b[^>]*>/gi;
  tags.lastIndex = open.index + open[0].length;
  let match;
  while ((match = tags.exec(html))) {
    depth += match[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(open.index + open[0].length, match.index);
  }
  return "";
}

function quoteAttrs(tag) {
  return tag.replace(
    /(\s(?:href|src|data-src|data-lazy-src)\s*=\s*)'([^']*)'/gi,
    '$1"$2"',
  );
}

function youtubeIdFrom(html) {
  const match = html.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/i,
  );
  return match?.[1] ?? null;
}

function skipImage(url) {
  const path = url.split("?")[0];
  return /(?:^|\/)(?:btn\.png|two\.png)$/i.test(path) || /gcao-logo/i.test(path);
}

function absoluteUrl(url) {
  if (!url || url.startsWith("data:")) return "";
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `https://gcaocanada.org${url}`;
  if (/^https?:\/\//i.test(url)) return url;
  return "";
}

async function curl(args, encoding) {
  const { stdout } = await exec("curl", ["-fsSL", "-A", UA, ...args], {
    maxBuffer: 20 * 1024 * 1024,
    encoding,
  });
  return stdout;
}

async function fetchHtml(url) {
  return curl(["-H", "Accept: text/html", url], "utf8");
}

function imageExt(url, bytes) {
  const fromUrl = url.split("?")[0].match(/\.(jpe?g|png|webp)$/i)?.[1]?.toLowerCase();
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (fromUrl === "jpeg") return "jpg";
  if (fromUrl === "jpg" || fromUrl === "png" || fromUrl === "webp") return fromUrl;
  return "";
}

async function downloadImage(url, baseName) {
  const absolute = absoluteUrl(decodeEntities(url));
  if (!absolute || skipImage(absolute)) return "";
  if (!/\.(jpe?g|png|webp)(?:$|\?)/i.test(absolute.split("#")[0])) return "";
  const temp = resolve(UPLOADS, `.${baseName}.download`);
  try {
    await curl(["-o", temp, absolute], "buffer");
    const bytes = await readFile(temp);
    const ext = imageExt(absolute, bytes);
    if (!ext || bytes.length < 32) {
      await unlink(temp).catch(() => {});
      return "";
    }
    const filename = `${baseName}.${ext}`;
    await writeFile(resolve(UPLOADS, filename), bytes);
    await unlink(temp).catch(() => {});
    return `/images/uploads/${filename}`;
  } catch {
    await unlink(temp).catch(() => {});
    return "";
  }
}

function imageSrc(tag) {
  const srcset = tag.match(/\bsrcset\s*=\s*"([^"]+)"/i)?.[1];
  if (srcset) {
    let best = "";
    let bestWidth = 0;
    for (const part of srcset.split(",")) {
      const [url, size] = part.trim().split(/\s+/);
      const width = Number(size?.replace(/w$/i, "")) || 0;
      if (url && width >= bestWidth) {
        best = url;
        bestWidth = width;
      }
    }
    if (best) return decodeEntities(best);
  }
  const candidates = [...tag.matchAll(/\b(?:src|data-src|data-lazy-src)\s*=\s*"([^"]+)"/gi)].map(
    (match) => decodeEntities(match[1]),
  );
  return candidates.find((src) => absoluteUrl(src) && !src.startsWith("data:")) ?? "";
}

async function localizeImages(html, slug) {
  let index = 0;
  let result = "";
  let cursor = 0;
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    result += html.slice(cursor, match.index);
    cursor = match.index + match[0].length;
    const src = imageSrc(quoteAttrs(match[0]));
    index += 1;
    const local = src ? await downloadImage(src, `blog-${slug}-${index}`) : "";
    if (local) result += `<img src="${local}" alt="">`;
  }
  return result + html.slice(cursor);
}

function prepareBody(html) {
  return decodeTypography(quoteAttrs(html))
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\[[a-z0-9_-]+(?:\s[^\]]*)?\]/gi, "")
    .replace(/<iframe\b[^>]*youtube[\s\S]*?<\/iframe>/gi, "")
    .replace(/<p\b[^>]*>\s*I am text block\. Click edit button to change this text\.[\s\S]*?<\/p>/gi, "")
    .replace(/<a\b[^>]*href="[^"]+\.(?:jpe?g|png|webp)"[^>]*>\s*(<img\b[^>]*>)\s*<\/a>/gi, "$1");
}

async function listPosts() {
  const posts = [];
  for (let page = 1; page <= 11; page += 1) {
    const url =
      page === 1
        ? "https://gcaocanada.org/blog-list/"
        : `https://gcaocanada.org/blog-list/page/${page}/`;
    const html = await fetchHtml(url);
    for (const match of html.matchAll(/<article([^>]*)>([\s\S]*?)<\/article>/g)) {
      const block = match[2];
      const titleMatch = block.match(/<h[1-6][^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
      const dateMatch = block.match(/grop-news_ps_date[\s\S]*?(\d{1,2}\s+\w+\s+\d{4})/);
      const imageMatch = block.match(/<img[^>]+src="([^"]+)"/i);
      if (!titleMatch || !dateMatch) continue;
      const date = parseBlogDate(dateMatch[1]);
      if (!date) continue;
      posts.push({
        title: plainTitle(titleMatch[2]),
        url: decodeEntities(titleMatch[1]),
        date,
        image: imageMatch ? decodeEntities(imageMatch[1]) : "",
      });
    }
  }
  return posts;
}

function openDb() {
  return mysql.createConnection({
    host: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    enableKeepAlive: true,
  });
}

async function main() {
  loadEnvLocal();
  await mkdir(UPLOADS, { recursive: true });
  const conn = await openDb();

  const [news] = await conn.query("SELECT title, slug FROM news");
  const [events] = await conn.query("SELECT title, slug FROM events");
  const takenTitles = new Set(
    [...news, ...events].map((row) => normalizeTitle(row.title)),
  );
  takenTitles.add(normalizeTitle("Emancipation Month 2024"));
  const takenSlugs = new Set(news.map((row) => row.slug));
  await conn.end();

  const posts = await listPosts();
  const recent = posts.filter((post) => post.date.year >= 2021);
  const missing = recent.filter((post) => !takenTitles.has(normalizeTitle(post.title)));
  console.log(
    `archive ${posts.length}, since 2021 ${recent.length}, already here ${recent.length - missing.length}, to import ${missing.length}`,
  );

  let imported = 0;
  let writer = null;
  for (const post of missing) {
    const html = await fetchHtml(post.url);
    const raw = innerDiv(html, "grop-sigl_content");
    const youtubeId = youtubeIdFrom(raw)?.slice(0, 20) || null;
    let slug = slugify(post.title);
    let suffix = 2;
    while (takenSlugs.has(slug)) {
      slug = `${slugify(post.title).slice(0, 77)}-${suffix}`;
      suffix += 1;
    }
    const prepared = prepareBody(raw);
    const localized = write ? await localizeImages(prepared, slug) : prepared;
    const wide = sanitizeAdminHtml(localized);
    const needsWide =
      /<\/?(?:h2|h3|img|table|ol|blockquote)\b/i.test(wide) ||
      /<a\b[^>]*href="https?:/i.test(wide);
    const bodyHtml = needsWide ? wide : sanitizeRichText(localized);
    const excerpt = excerptFrom(bodyHtml || wide, post.title) || post.title;
    const body = bodyHtml || `<p>${excerpt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
    const bodyMode = bodyHtml && needsWide ? "html" : "formatted";
    const category = groupFor(post.title);
    const author = authorFor(post.title);
    const imageUrl = write ? await downloadImage(post.image, `blog-${slug}`) : post.image && !skipImage(post.image) ? "pending" : "";

    console.log(
      [
        write ? "write" : "plan",
        post.date.sql.slice(0, 10),
        bodyMode,
        category || "-",
        imageUrl ? "image" : "no-image",
        youtubeId ? "video" : "-",
        slug,
        post.title,
      ].join(" | "),
    );
    console.log(`  ${excerpt.slice(0, 140)}`);

    takenSlugs.add(slug);
    takenTitles.add(normalizeTitle(post.title));
    if (!write) continue;
    if (post.title.length > 255) {
      throw new Error(`Title is longer than 255 characters: ${post.title.length}`);
    }
    if (!writer) writer = await openDb();
    try {
      await writer.query("SELECT 1");
    } catch {
      writer = await openDb();
    }
    await writer.execute(
      `INSERT INTO news (title, slug, kind, category, excerpt, body, image_url, published_at, status, author_name, body_mode, youtube_id, featured)
       VALUES (?, ?, 'news', ?, ?, ?, ?, ?, 'published', ?, ?, ?, 0)`,
      [post.title, slug, category, excerpt, body, imageUrl, post.date.sql, author, bodyMode, youtubeId],
    );
    imported += 1;
  }

  if (!write || !writer) {
    console.log("dry run only");
    return;
  }
  const [countRows] = await writer.query("SELECT COUNT(*) AS total FROM news");
  console.log(`imported ${imported}; news rows ${countRows[0].total}`);
  await writer.end();
  await stat(UPLOADS);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Import failed";
  console.error(message.replace(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, "[host]"));
  process.exit(1);
});
