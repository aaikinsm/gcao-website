"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedHeadlineProps {
  before: string;
  words: string[];
  after: string;
  className?: string;
  highlightClassName?: string;
  intervalMs?: number;
}

/**
 * CEE Toronto-style animated headline: one rotating highlighted word
 * with a gold underline, cycling every few seconds.
 */
export function AnimatedHeadline({
  before,
  words,
  after,
  className = "",
  highlightClassName = "text-[#FCD116]",
  intervalMs = 2500,
}: AnimatedHeadlineProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !visible || words.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, reducedMotion, visible, words.length]);

  const word = words[index] ?? words[0];

  return (
    <span ref={ref} className={className}>
      {before}{" "}
      <span
        key={word}
        className={`relative inline-block animate-fade-in font-semibold ${highlightClassName}`}
      >
        {word}
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-1 h-[3px] origin-left animate-marker rounded-full bg-[#FCD116]"
        />
      </span>{" "}
      {after}
    </span>
  );
}
