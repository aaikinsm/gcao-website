"use client";

import { useEffect, useRef, useState } from "react";

interface VideoHeroProps {
  src: string;
  poster: string;
  youtubeId?: string;
  className?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
}

/**
 * Obama.org-style full-bleed muted looping video background.
 * Falls back to a YouTube iframe if the local file fails to load,
 * and to the poster alone when the user prefers reduced motion.
 */
export function VideoHero({
  src,
  poster,
  youtubeId = "XJ7tzm23NUo",
  className = "",
  overlayClassName = "bg-gradient-to-t from-[#06110D] via-[#06110D]/70 to-[#06110D]/45",
  children,
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useYoutube, setUseYoutube] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reducedMotion || useYoutube) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playbackRate = 0.75;
    const play = video.play();
    if (play) {
      play.catch(() => setUseYoutube(true));
    }
  }, [reducedMotion, useYoutube]);

  const youtubeSrc = `https://www.youtube-nocookie.com/embed/${youtubeId}?start=0&end=60&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${youtubeId}&disablekb=1`;

  return (
    <section className={`relative min-h-[100svh] overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        {/* Poster always present as base layer */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />

        {!reducedMotion && !useYoutube && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
            onError={() => setUseYoutube(true)}
          >
            <source src={src} type="video/mp4" />
          </video>
        )}

        {!reducedMotion && useYoutube && (
          <iframe
            title="GCAO community video"
            src={youtubeSrc}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
            allow="autoplay; encrypted-media"
            tabIndex={-1}
          />
        )}

        <div className={`absolute inset-0 ${overlayClassName}`} />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-20 pt-32 md:pb-28 md:pt-36">
        {children}
      </div>
    </section>
  );
}
