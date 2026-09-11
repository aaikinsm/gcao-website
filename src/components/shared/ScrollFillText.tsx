"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollFillTextProps {
  text: string;
  className?: string;
  mutedClassName?: string;
  filledClassName?: string;
}

/**
 * Words fill from muted to bright as the block scrolls through the viewport.
 * Inspired by Obama.org mission lines and CEE-style scroll reveals.
 */
export function ScrollFillText({
  text,
  className = "",
  mutedClassName = "text-white/25",
  filledClassName = "text-[#EFEDE4]",
}: ScrollFillTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }

    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const update = () => {
      const rect = node.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      // Fill as the block moves from lower third into the upper half
      const start = viewH * 0.85;
      const end = viewH * 0.35;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  const filledCount = Math.floor(progress * words.length);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={`transition-colors duration-300 ${
            i < filledCount ? filledClassName : mutedClassName
          }`}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
