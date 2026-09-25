import { parseNewsKind, type NewsKind } from "@/lib/news-types";
import { toEditorHtml } from "@/lib/rich-text";

export type AiPostType = "event" | "update";

export type AiDraftFields = {
  postType: AiPostType;
  kind: NewsKind;
  title: string;
  excerpt: string;
  body: string;
  location: string;
  startsAt: string;
  endsAt: string;
  category: string;
};

const SYSTEM = `You help GCAO staff draft public website copy for the Ghanaian-Canadian Association of Ontario.
Return only JSON. Do not invent phone numbers or personal email addresses. Official @gcaocanada.org addresses are fine if they appear in the source.
postType is "event" when there is a specific gathering with a date and place; otherwise "update".
kind is only for updates: "news" (report of something that happened or is underway), "notice" (short operational bulletin: hours, deadline, registration, closure), or "story" (longer feature, tribute, or leadership voice). If unsure, use "news".
category is one of Health, Community, Culture.
When postType is "event": fill excerpt with one or two sentences from the source; fill location with the venue and address only if printed; fill startsAt from the printed start date and time; fill endsAt only if an end time or range is printed. If a fact is missing, leave that field empty. Do not invent a venue or date.
startsAt and endsAt must be empty or datetime-local form YYYY-MM-DDTHH:mm in America/Toronto.
Write polished, warm, clear English. Body must be an HTML subset using only <p>, <br>, <strong>, <em>, <u>, <ul>, and <li>. Use <strong> for emphasis, <em> for italics, <u> for underline, and <ul><li> for lists when the source has them. Do not use markdown like **bold** or "- " lines.`;

function apiKey() {
  return process.env.OPENAI_API_KEY?.trim() ?? "";
}

export function openaiConfigured() {
  return apiKey().length > 0;
}

function emptyDraft(): AiDraftFields {
  return {
    postType: "update",
    kind: "news",
    title: "",
    excerpt: "",
    body: "",
    location: "",
    startsAt: "",
    endsAt: "",
    category: "Community",
  };
}

const MONTHS: Record<string, number> = {
  january: 1,
  jan: 1,
  february: 2,
  feb: 2,
  march: 3,
  mar: 3,
  april: 4,
  apr: 4,
  may: 5,
  june: 6,
  jun: 6,
  july: 7,
  jul: 7,
  august: 8,
  aug: 8,
  september: 9,
  sept: 9,
  sep: 9,
  october: 10,
  oct: 10,
  november: 11,
  nov: 11,
  december: 12,
  dec: 12,
};

const MONTH_PATTERN =
  "january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sept|sep|oct|nov|dec";

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function torontoToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");
  return { year: get("year"), month: get("month"), day: get("day") };
}

function resolveYear(month: number, day: number, year?: number) {
  if (year) return year;
  const today = torontoToday();
  if (month < today.month || (month === today.month && day < today.day)) {
    return today.year + 1;
  }
  return today.year;
}

function parseClock(raw: string): { hour: number; minute: number } | null {
  const twelve = raw.match(/\b(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)\b/i);
  if (twelve) {
    let hour = Number(twelve[1]);
    const minute = Number(twelve[2] ?? 0);
    const afternoon = twelve[3].toLowerCase().includes("p");
    if (hour === 12) hour = afternoon ? 12 : 0;
    else if (afternoon) hour += 12;
    if (hour > 23 || minute > 59) return null;
    return { hour, minute };
  }
  const twentyFour = raw.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (twentyFour) return { hour: Number(twentyFour[1]), minute: Number(twentyFour[2]) };
  return null;
}

function formatLocal(year: number, month: number, day: number, hour: number, minute: number) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return "";
  return `${year}-${pad2(month)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}`;
}

function normalizeDate(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  const iso = raw.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::\d{2})?$/);
  if (iso) return `${iso[1]}T${iso[2]}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T00:00`;

  const ymd = raw.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (ymd) {
    const clock = parseClock(raw.slice((ymd.index ?? 0) + ymd[0].length)) ?? { hour: 0, minute: 0 };
    return formatLocal(Number(ymd[1]), Number(ymd[2]), Number(ymd[3]), clock.hour, clock.minute);
  }

  const monthFirst = raw.match(
    new RegExp(`\\b(${MONTH_PATTERN})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?!\\d)(?:,?\\s+(\\d{4}))?`, "i"),
  );
  const dayFirst = raw.match(
    new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_PATTERN})(?:,?\\s+(\\d{4}))?`, "i"),
  );
  const named = monthFirst
    ? {
        month: MONTHS[monthFirst[1].toLowerCase()],
        day: Number(monthFirst[2]),
        year: monthFirst[3] ? Number(monthFirst[3]) : undefined,
        after: raw.slice((monthFirst.index ?? 0) + monthFirst[0].length),
      }
    : dayFirst
      ? {
          month: MONTHS[dayFirst[2].toLowerCase()],
          day: Number(dayFirst[1]),
          year: dayFirst[3] ? Number(dayFirst[3]) : undefined,
          after: raw.slice((dayFirst.index ?? 0) + dayFirst[0].length),
        }
      : null;
  if (!named?.month) return "";

  const clock = parseClock(named.after) ?? parseClock(raw) ?? { hour: 0, minute: 0 };
  return formatLocal(resolveYear(named.month, named.day, named.year), named.month, named.day, clock.hour, clock.minute);
}

export function normalizeAiDraft(raw: unknown): AiDraftFields {
  const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const postType = data.postType === "event" ? "event" : "update";
  const category = String(data.category ?? "Community");
  return {
    postType,
    kind: parseNewsKind(String(data.kind ?? "news")),
    title: String(data.title ?? "").trim(),
    excerpt: String(data.excerpt ?? "").trim(),
    body: toEditorHtml(String(data.body ?? "")),
    location: String(data.location ?? "").trim(),
    startsAt: normalizeDate(data.startsAt),
    endsAt: normalizeDate(data.endsAt),
    category: ["Health", "Community", "Culture"].includes(category) ? category : "Community",
  };
}

async function chat(messages: unknown[]) {
  if (!openaiConfigured()) {
    throw new Error("AI is not set up on this computer.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail.slice(0, 240) || "The AI request failed.");
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) return emptyDraft();
  try {
    return normalizeAiDraft(JSON.parse(content));
  } catch {
    return emptyDraft();
  }
}

export async function draftFromSource(source: string) {
  return chat([
    { role: "system", content: SYSTEM },
    {
      role: "user",
      content: `Read any printed date, time, and place first. Then draft a GCAO website post from these notes or extracted text. Do not invent a venue or date that is not in the source.\n\n${source.slice(0, 12000)}`,
    },
  ]);
}

export async function draftFromImage(bytes: Buffer, mime: string) {
  const dataUrl = `data:${mime};base64,${bytes.toString("base64")}`;
  return chat([
    { role: "system", content: SYSTEM },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Read the printed date, time, and place first. Then draft a GCAO website post from this flyer or document image. Do not invent a venue or date that is not printed.",
        },
        { type: "image_url", image_url: { url: dataUrl } },
      ],
    },
  ]);
}

export async function rewriteDraft(input: {
  postType: AiPostType;
  title: string;
  excerpt: string;
  body: string;
  location?: string;
}) {
  return chat([
    { role: "system", content: SYSTEM },
    {
      role: "user",
      content: `Polish this ${input.postType} for the GCAO website. Keep the facts. Improve clarity and warmth.\n${JSON.stringify(input)}`,
    },
  ]);
}

export async function classifyArticleKind(input: {
  title: string;
  excerpt: string;
  body: string;
}): Promise<NewsKind> {
  const draft = await chat([
    { role: "system", content: SYSTEM },
    {
      role: "user",
      content: `Classify this update. Set postType to "update". Return kind as news, notice, or story.\n${JSON.stringify(input)}`,
    },
  ]);
  return draft.kind;
}

export async function generateImagePng(title: string, excerpt: string) {
  if (!openaiConfigured()) {
    throw new Error("AI is not set up on this computer.");
  }

  const prompt = `Editorial photograph for a Ghanaian-Canadian community association website. No text, logos, or watermarks. Warm, dignified, documentary. Subject: ${title}. ${excerpt}`.slice(
    0,
    900,
  );

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail.slice(0, 240) || "Image generation failed.");
  }

  const payload = (await response.json()) as { data?: { url?: string }[] };
  const url = payload.data?.[0]?.url;
  if (!url) throw new Error("The image service returned no file.");

  const image = await fetch(url);
  if (!image.ok) throw new Error("Could not download the generated image.");
  return Buffer.from(await image.arrayBuffer());
}
