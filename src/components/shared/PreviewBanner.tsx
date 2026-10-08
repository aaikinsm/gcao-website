interface PreviewBannerProps {
  option: string;
  topClass?: string;
}

export function PreviewBanner({ option, topClass = "top-0" }: PreviewBannerProps) {
  return (
    <div className={`sticky z-[60] animate-fade-in bg-black px-4 py-2 text-center text-sm text-white ${topClass}`}>
      <span className="font-semibold">Design Preview: Option {option}</span>
      <span className="mx-2 opacity-40">|</span>
      <a href="/" className="underline underline-offset-2 transition-opacity hover:opacity-80">
        View all previews
      </a>
    </div>
  );
}
