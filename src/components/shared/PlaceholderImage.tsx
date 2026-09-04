interface PlaceholderImageProps {
  label: string;
  aspect?: "wide" | "square" | "tall" | "hero";
  className?: string;
}

const aspectClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  tall: "aspect-[3/4]",
  hero: "aspect-[21/9] min-h-[320px]",
};

export function PlaceholderImage({
  label,
  aspect = "wide",
  className = "",
}: PlaceholderImageProps) {
  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-2xl border-2 border-dashed border-black/15 bg-gradient-to-br from-gray-100 to-gray-200 ${aspectClasses[aspect]} ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,107,63,0.08),rgba(252,209,22,0.12))]" />
      <div className="relative w-full p-4">
        <span className="inline-block rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
          Placeholder — replace before launch
        </span>
        <p className="mt-2 max-w-sm text-sm font-medium text-gray-700">{label}</p>
      </div>
    </div>
  );
}
