"use client"
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Register SplitText plugin
gsap.registerPlugin(SplitText);

interface SplitTextComponentProps {
  children: React.ReactNode;
  className?: string;
}

const SplitTextComponent: React.FC<SplitTextComponentProps> = ({ children, className = '' }) => {
  const textRef = useRef(null);

  useEffect(() => {
    // Wait for fonts to load
    document.fonts.ready.then(() => {
      gsap.set(textRef.current, { opacity: 1 });
      
      let mySplitText = new SplitText(textRef.current, { 
        type: "chars, words" 
      });

      gsap.from(mySplitText.chars, {
        duration: 2,
        opacity: 0,
        stagger: { from: "random", each: 0.01 }
      });

      // Cleanup function
      return () => {
        if (mySplitText) {
          mySplitText.revert();
        }
      };
    });
  }, [children]);

  return (
    <h3 
      ref={textRef} 
      className={`animated-text ${className}`}
      style={{ opacity: 0 }}
    >
      {children}
    </h3>
  );
};

export default SplitTextComponent;

// "use client";

// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { SplitText } from "gsap/all";
// If using local file:
// import SplitText from "@/lib/SplitText";

gsap.registerPlugin(SplitText);

export function VerticalTextSlider({ children, lineHeight = 50, duration = 0.3 }) {
  const listRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;

    const slides = Array.from(listRef.current.children);

    const tl = gsap.timeline({
      paused: true,
      repeat: -1,
    });

    slides.forEach((slide, i) => {
      const label = `slide-${i}`;

      tl.add(label);

      // Move the entire list
      tl.to(
        listRef.current,
        {
          duration,
          y: i * -lineHeight,
        },
        label
      );

      // Split & animate characters
      const letters = new SplitText(slide, { type: "chars" }).chars;

      tl.from(
        letters,
        {
          duration,
          y: lineHeight,
          stagger: duration / 10,
          ease: "power2.out",
        },
        label
      );

      tl.to({}, { duration: 1 }); // pause before next slide
    });

    tl.play();

    return () => tl.kill();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: lineHeight,
        // overflow: "hidden",
        // textAlign: "center",
        // border: "1px solid #4BB3FD",
      }}
    >
      <ul ref={listRef} style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {children.map((text, i) => (
          <li
            key={i}
            style={{
              fontSize: 24,
              lineHeight: `${lineHeight}px`,
              height: lineHeight,
              color: "#4BB3FD",
            }}
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
