"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger,  } from 'gsap/dist/ScrollTrigger';
import Observer from 'gsap/dist/Observer';

gsap.registerPlugin(ScrollTrigger, Observer);

const SwipeSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const currentIndexRef = useRef(0);
  const animatingRef = useRef(false);
  const observerRef = useRef<any>(null);

  const panels = [
    { id: 1, color: 'bg-red-500', content: 'Video 1', initialY: 0 },
    { id: 2, color: 'bg-purple-500', content: 'Video 2', initialY: 100 },
    { id: 3, color: 'bg-blue-500', content: 'Video 3', initialY: 100 },
    { id: 4, color: 'bg-orange-500', content: 'Video 4', initialY: 100 }
  ];

  useEffect(() => {
    const swipePanels = panelsRef.current.filter(Boolean);

    // Set initial yPercent for panels with y-100 class
    gsap.set(swipePanels.slice(1), { yPercent: 100 });

    // Set z-index levels for the swipe panels
    gsap.set(swipePanels, {
      zIndex: (i) => i
    });

    const gotoPanel = (index: number, scrollingDown: boolean) => {
      if (index > -1 && index < swipePanels.length) {
        animatingRef.current = true;
        currentIndexRef.current = index;
        const target = scrollingDown ? swipePanels[index] : swipePanels[index + 1];
        
        gsap.to(target, {
          yPercent: scrollingDown ? 0 : 100,
          ease: "power1.inOut",
          onComplete: () => {
            animatingRef.current = false;
            if (index === swipePanels.length - 1) {
              observerRef.current?.disable();
            }
          }
        });
      }
    };

    observerRef.current = ScrollTrigger.observe({
      type: "wheel,touch",
      onUp: () => !animatingRef.current && gotoPanel(currentIndexRef.current + 1, true),
      onDown: () => !animatingRef.current && gotoPanel(currentIndexRef.current - 1, false),
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      onPress: (self: any) => {
        ScrollTrigger.isTouch && self.event.preventDefault();
      }
    });

    return () => {
      observerRef.current?.kill();
    };
  }, []);

  return (
    <>
      <div 
        ref={sectionRef}
        className="swipe-section relative h-screen w-full overflow-visible"
      >
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            ref={(el) => {
              if (el) panelsRef.current[index] = el;
            }}
            className={`panel absolute w-full h-full flex justify-center items-center font-semibold text-2xl text-center text-white ${panel.color} p-10`}
          >
            {panel.content}
          </div>
        ))}
      </div>
      
      <div className="h-screen bg-gray-200 flex items-center justify-center">
        <p className="text-2xl font-semibold text-gray-700">Rest of the page</p>
      </div>
    </>
  );
};

export default SwipeSection;