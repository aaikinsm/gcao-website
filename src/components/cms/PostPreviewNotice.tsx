import type { SankofaTheme } from "@/components/previews/sankofaTheme";

export function PostPreviewNotice({
  published,
  theme,
  path,
}: {
  published: boolean;
  theme: SankofaTheme;
  path: string;
}) {
  const darkHref = path;
  const lightHref = `${path}?theme=light`;
  return (
    <span className="truncate">
      {published
        ? "Preview. This post is live on the site."
        : "Preview. This post is not on the public site yet."}
      <span className="mx-2 opacity-40">|</span>
      <a href={darkHref} className={theme === "dark" ? "underline" : "opacity-70"}>
        Dark
      </a>
      <span className="mx-1.5 opacity-40">·</span>
      <a href={lightHref} className={theme === "light" ? "underline" : "opacity-70"}>
        Light
      </a>
    </span>
  );
}

export function previewTheme(value: string | undefined): SankofaTheme {
  return value === "light" ? "light" : "dark";
}
