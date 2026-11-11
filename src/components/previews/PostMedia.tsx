import { isImageAttachment, type PostAttachment } from "@/lib/attachments";
import { SiteImage } from "@/components/shared/SiteImage";

export function PostVideo({ youtubeId }: { youtubeId: string | null }) {
  if (!youtubeId) return null;
  return (
    <div className="mt-10 aspect-video overflow-hidden rounded-2xl">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title="Video"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function PostAttachmentsView({
  attachments,
  linkClass,
}: {
  attachments: PostAttachment[];
  linkClass: string;
}) {
  const images = attachments.filter((item) => isImageAttachment(item.url));
  const files = attachments.filter((item) => !isImageAttachment(item.url));
  if (!images.length && !files.length) return null;

  return (
    <div className="mt-12 space-y-10">
      {images.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((item) => (
            <figure key={item.id}>
              <SiteImage
                src={item.url}
                alt={item.caption || item.filename}
                className="aspect-[16/10] overflow-hidden rounded-2xl"
                sizes="(min-width: 768px) 24rem, 100vw"
              />
              {item.caption ? <figcaption className="mt-2 text-sm">{item.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      ) : null}
      {files.length > 0 ? (
        <ul className="space-y-3">
          {files.map((item) => (
            <li key={item.id}>
              <a href={item.url} className={`font-semibold underline ${linkClass}`}>
                {item.caption || item.filename}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
