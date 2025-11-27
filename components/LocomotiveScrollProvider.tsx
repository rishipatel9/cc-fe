"use client";
import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LocomotiveScrollProviderProps {
  children: ReactNode;
}

export default function LocomotiveScrollProvider({ children }: LocomotiveScrollProviderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locoScrollRef = useRef<any>(null);

  useEffect(() => {
    // Prevent execution on server
    if (typeof window === "undefined") return;

    let animationFrameId: number;
    let mutationObserver: MutationObserver;

    const initializeLocoScroll = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const LocomotiveScroll = (await import("locomotive-scroll")).default;

        if (!scrollRef.current) return;

        // Initialize Locomotive Scroll
        locoScrollRef.current = new LocomotiveScroll({
          el: scrollRef.current,
          smooth: true,
          multiplier: 0.3, // Scroll speed multiplier
          lerp: 0.8, // Linear interpolation for smoothness (0-1)
          smartphone: { smooth: true },
          tablet: { smooth: true },
          reloadOnContextChange: true,
        });

        const locoScroll = locoScrollRef.current;
        
        // Make Locomotive Scroll instance available globally
        (window as any).locomotiveScroll = locoScroll;

        // ====================================
        // CRITICAL: ScrollTrigger Proxy Setup
        // ====================================
        // This tells ScrollTrigger to use Locomotive's virtual scroll
        // instead of native browser scroll
        ScrollTrigger.scrollerProxy(scrollRef.current, {
          scrollTop(value) {
            // Getter/Setter for scroll position
            if (arguments.length) {
              // Setter: when ScrollTrigger needs to set scroll position
              locoScroll.scrollTo(value, { duration: 0, disableLerp: true });
            }
            // Getter: return current scroll position
            return locoScroll.scroll.instance.scroll.y;
          },
          getBoundingClientRect() {
            // Tell ScrollTrigger the scroller's dimensions
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
          // Use 'transform' for smoother pinning if using CSS transforms
          pinType: scrollRef.current!.style.transform ? "transform" : "fixed",
        });

        // ====================================
        // SYNC: Locomotive Scroll → ScrollTrigger
        // ====================================
        // Every time Locomotive updates, tell ScrollTrigger
        locoScroll.on("scroll", () => {
          ScrollTrigger.update();
        });

        // When ScrollTrigger refreshes, update Locomotive
        ScrollTrigger.addEventListener("refresh", () => {
          locoScroll.update();
        });

        // ====================================
        // REFRESH STRATEGY (Multi-Stage)
        // ====================================
        const refresh = () => {
          if (locoScroll) {
            locoScroll.update();
            ScrollTrigger.refresh();
          }
        };

        // Stage 1: Immediate (initial layout)
        refresh();

        // Stage 2: After all images/fonts load
        if (document.readyState === "complete") {
          refresh();
        } else {
          window.addEventListener("load", refresh);
        }

        // Stage 3: Delayed refreshes (catches late-loading content)
        const delays = [100, 500, 1000, 2000];
        const timeouts = delays.map(delay => setTimeout(refresh, delay));

        // ====================================
        // DOM MUTATION OBSERVER
        // ====================================
        // Watch for DOM changes (new components, images, etc.)
        mutationObserver = new MutationObserver(() => {
          // Debounce using requestAnimationFrame
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(refresh);
        });

        mutationObserver.observe(scrollRef.current, {
          childList: true, // Watch for added/removed nodes
          subtree: true, // Watch all descendants
          attributes: false, // Don't watch attribute changes (too noisy)
        });

        // ====================================
        // RESIZE HANDLER
        // ====================================
        const handleResize = () => {
          refresh();
        };

        let resizeTimeout: NodeJS.Timeout;
        const debouncedResize = () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(handleResize, 250);
        };

        window.addEventListener("resize", debouncedResize);

        // Cleanup function
        return () => {
          timeouts.forEach(clearTimeout);
          clearTimeout(resizeTimeout);
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          window.removeEventListener("load", refresh);
          window.removeEventListener("resize", debouncedResize);
          mutationObserver?.disconnect();
        };
      } catch (error) {
        console.error("Failed to initialize Locomotive Scroll:", error);
      }
    };

    // Initialize
    const cleanup = initializeLocoScroll();

    // Main cleanup
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
      
      // Destroy Locomotive Scroll instance
      if (locoScrollRef.current) {
        locoScrollRef.current.destroy();
        locoScrollRef.current = null;
      }

      // Kill all ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Clear ScrollTrigger's scroller cache
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container className="overflow-hidden">
      {children}
    </div>
  );
}