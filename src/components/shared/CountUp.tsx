"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string;
  className?: string;
  duration?: number;
}

function parseStat(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) {
    return { target: 0, suffix: value };
  }
  return { target: Number(match[1]), suffix: match[2] ?? "" };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function CountUp({ value, className = "", duration = 1200 }: CountUpProps) {
  const { target, suffix } = parseStat(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(`${0}${suffix}`);
  const started = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    const start = () => {
      if (started.current) return;
      started.current = true;

      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.round(easeOutCubic(progress) * target);
        setDisplay(`${current}${suffix}`);
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [duration, suffix, target, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
}
