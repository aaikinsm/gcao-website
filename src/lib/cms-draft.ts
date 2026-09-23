import type { NewsKind } from "@/lib/news-types";
import type { AiPostType } from "@/lib/openai";

export type EventDraft = {
  title?: string;
  excerpt?: string;
  body?: string;
  location?: string;
  startsAt?: string;
  endsAt?: string;
  imageUrl?: string;
};

export type ArticleDraft = {
  title?: string;
  excerpt?: string;
  body?: string;
  kind?: NewsKind;
  category?: string;
  imageUrl?: string;
};

export type AiComposeResult = {
  error?: string;
  postType?: AiPostType;
  kind?: NewsKind;
  title?: string;
  excerpt?: string;
  body?: string;
  location?: string;
  startsAt?: string;
  endsAt?: string;
  category?: string;
  imageUrl?: string;
};
