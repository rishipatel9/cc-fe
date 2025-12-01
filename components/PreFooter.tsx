"use client"
import React, { useEffect, useRef, useState } from "react";

const DOT_COLORS = ["#ff3b30", "#34c759", "#ffcc00", "#af52de", "#0fb9b1"];

const PreFooter = () => {
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  let lastScroll = 0;

  // ✅ Check if running on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if device is mobile/tablet
  useEffect(() => {
    if (!isClient) return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isClient]);

  // Dot animation for desktop only
  useEffect(() => {
    if (!isClient || isMobile) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScroll ? "down" : "up";
      lastScroll = scrollY;

      dotsRef.current.forEach((dot) => {
        if (!dot) return;
        
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 100;
        
        dot.style.transform = `translate(${randomX}px, ${randomY}px)`;
        dot.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      });

      setTimeout(() => {
        dotsRef.current.forEach((dot) => {
          if (!dot) return;
          dot.style.transform = "translate(0, 0)";
        });
      }, 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient, isMobile]);

  // Don't render dots until client-side
  if (!isClient) {
    return (
      <div className="relative z-10 flex flex-col justify-center items-center flex-1 text-center px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
          Ready to offset your carbon?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-2xl">
          Join thousands making a real impact on climate change
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg transition-all duration-300">
          Get Started →
        </button>
      </div>
    );
  }

  const totalDots = 30;
  const curveHeight = 150;

  return (
    <div className="relative w-full bg-white overflow-hidden" style={{ minHeight: "80vh" }}>
      {/* Animated dots */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: totalDots }).map((_, i) => {
            const t = i / (totalDots - 1);
            const xPercent = t * 100;
            const y = curveHeight * Math.pow(2 * t - 1, 2);

            return (
              <div
                key={i}
                ref={(el) => {
                  if (el) dotsRef.current[i] = el;
                }}
                style={{
                  position: "absolute",
                  left: `${xPercent}%`,
                  top: `${y}px`,
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: DOT_COLORS[i % DOT_COLORS.length],
                  transform: "translateX(-50%)",
                  opacity: 0.9,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center flex-1 text-center px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
          Ready to offset your carbon?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-2xl">
          Join thousands making a real impact on climate change
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg transition-all duration-300">
          Get Started →
        </button>
      </div>
    </div>
  );
};

export default PreFooter;