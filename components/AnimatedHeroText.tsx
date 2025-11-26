"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const heroWords = ["Measure", "Reduce", "Offset"];

const ActionWordCarousel = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const spans = gsap.utils.toArray<HTMLSpanElement>("[data-action-word]");
      gsap.set(spans, { yPercent: 100, opacity: 0 });

      const timeline = gsap.timeline({
        repeat: -1,
        defaults: { duration: 2, ease: "power4.inOut" },
      });

      timeline
        .to(spans, { yPercent: 0, opacity: 1, stagger: 1 })
        .to(spans, { yPercent: -100, opacity: 0, stagger: 1 }, 1);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex h-16 md:h-20 lg:h-24 overflow-hidden items-center"
    >
      {heroWords.map((word) => (
        <span
          key={word}
          data-action-word
          className="absolute inset-0 grid place-items-center text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
        >
          {word}
        </span>
      ))}
    </div>
  );
};

const AnimatedHeroText = () => {
  return (
    <div className="flex flex-col gap-4 items-center text-center">
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-3 md:gap-6">
        <ActionWordCarousel />
        <span className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider text-white/80">
          Carbon Emission
        </span>
      </div>
      <div className="flex items-center justify-center gap-3 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
        <span className="text-white/60">in</span>
        <span className="bg-emerald-400/20 backdrop-blur-sm px-6 py-2 rounded-lg text-emerald-200">
          Realtime
        </span>
      </div>
    </div>
  );
};

export default AnimatedHeroText;