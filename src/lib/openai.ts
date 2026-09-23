import { parseNewsKind, type NewsKind } from "@/lib/news-types";

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
startsAt and endsAt must be empty or datetime-local form YYYY-MM-DDTHH:mm in America/Toronto. Leave endsAt empty if unknown.
Write polished, warm, clear English. Body can use blank lines between paragraphs.`;

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

function normalizeDate(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/);
  if (match) return `${match[1]}T${match[2]}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T00:00`;
  return "";
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
    body: String(data.body ?? "").trim(),
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
      content: `Draft a GCAO website post from these notes or extracted text:\n\n${source.slice(0, 12000)}`,
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
          text: "Read this flyer or document image and draft a GCAO website post.",
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
