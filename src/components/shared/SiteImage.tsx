import Image from "next/image";

interface SiteImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  overlay?: string;
  priority?: boolean;
  sizes?: string;
}

export function SiteImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  overlay,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: SiteImageProps) {
  // Tailwind emits `.relative` after `.absolute`, so a hardcoded `relative` here
  // would win over a caller passing `absolute inset-0` and collapse the wrapper.
  const positioned = /(?:^|\s)(?:absolute|fixed|sticky)(?:\s|$)/.test(className);

  return (
    <div className={`${positioned ? "" : "relative"} overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${imageClassName}`}
      />
      {overlay && <div className={`absolute inset-0 ${overlay}`} />}
    </div>
  );
}
