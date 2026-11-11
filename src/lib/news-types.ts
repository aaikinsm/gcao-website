import type { PostAttachment } from "@/lib/attachments";
import type { BodyMode } from "@/lib/post-fields";
import type { PostStatus } from "@/lib/post-status";

export const NEWS_KINDS = ["news", "publication"] as const;
export type NewsKind = (typeof NEWS_KINDS)[number];

export function parseNewsKind(value: string | null | undefined): NewsKind {
  if (value === "publication") return value;
  return "news";
}

export function newsKindLabel(kind: NewsKind) {
  if (kind === "publication") return "Publications";
  return "News";
}

export const PUBLICATION_COVER = "/images/publication-cover.jpg";

export function newsCover(kind: string | null | undefined, imageUrl: string | null | undefined) {
  const image = imageUrl?.trim() ?? "";
  if (image) return image;
  if (kind === "publication") return PUBLICATION_COVER;
  return "";
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
  authorName: string | null;
  bodyMode: BodyMode;
  youtubeId: string | null;
  featured: boolean;
  attachments: PostAttachment[];
};
