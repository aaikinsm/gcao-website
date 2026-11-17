export function PostPreviewNotice({ published }: { published: boolean }) {
  return (
    <span className="truncate">
      {published
        ? "Preview. This post is live on the site."
        : "Preview. This post is not on the public site yet."}
    </span>
  );
}
