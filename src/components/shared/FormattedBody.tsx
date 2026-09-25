import type { ReactNode } from "react";
import { looksLikeHtml, RICH_TEXT_EDITOR_CLASS, sanitizeRichText } from "@/lib/rich-text";

function inlineBold(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    const match = part.match(/^\*\*([^*]+)\*\*$/);
    if (match) return <strong key={index}>{match[1]}</strong>;
    return <span key={index}>{part}</span>;
  });
}

export function FormattedBody({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  if (looksLikeHtml(text)) {
    return (
      <div
        className={`${RICH_TEXT_EDITOR_CLASS} ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizeRichText(text) }}
      />
    );
  }

  const blocks = text.split(/\n\n+/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className={`space-y-6 ${className}`}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const nodes: ReactNode[] = [];
        let bullets: string[] = [];

        const flushList = () => {
          if (!bullets.length) return;
          nodes.push(
            <ul key={`list-${blockIndex}-${nodes.length}`} className="list-disc space-y-2 pl-6">
              {bullets.map((item, itemIndex) => (
                <li key={itemIndex}>{inlineBold(item)}</li>
              ))}
            </ul>,
          );
          bullets = [];
        };

        lines.forEach((line, lineIndex) => {
          const bullet = line.match(/^-\s+(.*)$/);
          if (bullet) {
            bullets.push(bullet[1]);
            return;
          }
          flushList();
          if (line.trim()) {
            nodes.push(
              <p key={`p-${blockIndex}-${lineIndex}`}>{inlineBold(line)}</p>,
            );
          }
        });
        flushList();

        return (
          <div key={blockIndex} className="space-y-3">
            {nodes}
          </div>
        );
      })}
    </div>
  );
}
