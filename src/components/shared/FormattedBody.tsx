import type { ReactNode } from "react";
import { looksLikeHtml, RICH_TEXT_EDITOR_CLASS, sanitizeAdminHtml, sanitizeRichText } from "@/lib/rich-text";

function inlineBold(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    const match = part.match(/^\*\*([^*]+)\*\*$/);
    if (match) return <strong key={index}>{match[1]}</strong>;
    return <span key={index}>{part}</span>;
  });
}

const wideClass =
  "[&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-2xl [&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-2xl [&_table]:w-full [&_blockquote]:border-l-2 [&_blockquote]:pl-4";

export function FormattedBody({
  text,
  className = "",
  html = false,
}: {
  text: string;
  className?: string;
  html?: boolean;
}) {
  const wide = html || /<\/?(h2|h3|table|img|iframe|blockquote)\b/i.test(text);
  if (wide || looksLikeHtml(text)) {
    return (
      <div
        className={`${RICH_TEXT_EDITOR_CLASS} ${wide ? wideClass : ""} ${className}`}
        dangerouslySetInnerHTML={{ __html: wide ? sanitizeAdminHtml(text) : sanitizeRichText(text) }}
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
