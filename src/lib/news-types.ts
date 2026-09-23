export const NEWS_KINDS = ["news", "notice", "story"] as const;
export type NewsKind = (typeof NEWS_KINDS)[number];

export function parseNewsKind(value: string | null | undefined): NewsKind {
  if (value === "notice" || value === "story") return value;
  return "news";
}

export function newsKindLabel(kind: NewsKind) {
  if (kind === "notice") return "Notice";
  if (kind === "story") return "Story";
  return "News";
}

export type GcaoNews = {
  id: number;
  title: string;
  slug: string;
  kind: NewsKind;
  category: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  publishedAt: Date;
  status: "draft" | "published";
};
