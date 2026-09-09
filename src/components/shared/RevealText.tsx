interface RevealTextProps {
  text: string;
  className?: string;
  /** Milliseconds before the first word animates in. */
  startDelay?: number;
  /** Milliseconds between each word. */
  stagger?: number;
}

/**
 * Splits a headline into words that rise out of a clipping mask, one after another.
 * Pure CSS animation, so this stays a server component.
 */
export function RevealText({
  text,
  className = "",
  startDelay = 0,
  stagger = 70,
}: RevealTextProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="reveal-word">
            <span style={{ animationDelay: `${startDelay + i * stagger}ms` }}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
