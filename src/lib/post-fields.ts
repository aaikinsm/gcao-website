export type BodyMode = "formatted" | "html";

export function parseBodyMode(value: string | null | undefined): BodyMode {
  return value === "html" ? "html" : "formatted";
}

export function parseYoutubeInput(value: string): { id: string } | { error: string } {
  const trimmed = value.trim();
  if (!trimmed) return { id: "" };
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { error: "Use a YouTube link." };
  }
  const host = url.hostname.replace(/^www\./, "");
  let id = "";
  if (host === "youtu.be") {
    id = url.pathname.split("/").filter(Boolean)[0] ?? "";
  } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v") ?? "";
    else if (url.pathname.startsWith("/embed/") || url.pathname.startsWith("/shorts/")) {
      id = url.pathname.split("/")[2] ?? "";
    }
  } else {
    return { error: "Use a YouTube link." };
  }
  if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return { error: "Use a YouTube link." };
  return { id };
}

export function youtubeWatchUrl(id: string | null | undefined) {
  return id ? `https://www.youtube.com/watch?v=${id}` : "";
}
