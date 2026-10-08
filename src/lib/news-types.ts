import type { PostStatus } from "@/lib/post-status";

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

export const NEWS_GROUPS = ["Women's", "Men's", "Youth", "Welfare"] as const;
export type NewsGroup = (typeof NEWS_GROUPS)[number];

export function parseNewsGroup(value: string | null | undefined): NewsGroup | "" {
  if (value === "Women's" || value === "Men's" || value === "Youth" || value === "Welfare") return value;
  return "";
}

export function newsTypeLabel(kind: NewsKind, category: string) {
  const group = parseNewsGroup(category);
  const type = newsKindLabel(kind);
  return group ? `${type} · ${group}` : type;
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
  status: PostStatus;
};
