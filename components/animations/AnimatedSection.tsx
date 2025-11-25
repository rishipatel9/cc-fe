"use client"
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(Observer, SplitText, ScrollTrigger);

const AnimatedSections = () => {
  const componentRef = useRef(null);
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const outerWrappersRef = useRef([]);
  const innerWrappersRef = useRef([]);
  const imagesRef = useRef([]);
  const headingsRef = useRef([]);
  
  const currentIndex = useRef(-1);
  const animating = useRef(false);
  const splitHeadings = useRef([]);

  const sectionsData = [
    {
      className: "first",
      bgImage: "https://assets.codepen.io/16327/site-landscape-1.jpg",
      heading: "Scroll down"
    },
    {
      className: "second", 
      bgImage: "https://assets.codepen.io/16327/site-landscape-2.jpg",
      heading: "Animated with GSAP"
    },
    {
      className: "third",
      bgImage: "https://assets.codepen.io/16327/site-landscape-3.jpg", 
      heading: "GreenSock"
    },
    {
      className: "fourth",
      bgImage: "https://assets.codepen.io/16327/site-landscape-4.jpg",
      heading: "Animation platform"
    },
    {
      className: "fifth",
      bgImage: "https://assets.codepen.io/16327/site-landscape-5.jpg",
      heading: "Keep scrolling"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeAnimations();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (Observer.getById("sectionObserver")) {
        Observer.getById("sectionObserver").kill();
      }
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const initializeAnimations = () => {
    // Set initial states
    gsap.set(outerWrappersRef.current, { yPercent: 100 });
    gsap.set(innerWrappersRef.current, { yPercent: -100 });

    // Split text for animations
    splitHeadings.current = headingsRef.current.map(heading => 
      heading ? new SplitText(heading, { 
        type: "chars,words,lines", 
        linesClass: "clip-text" 
      }) : null
    ).filter(Boolean);

    // Start with first section
    gotoSection(0, 1);

    // Create observer for wheel, touch, and pointer events
    Observer.create({
      id: "sectionObserver",
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => !animating.current && gotoSection(currentIndex.current - 1, -1),
      onUp: () => !animating.current && gotoSection(currentIndex.current + 1, 1),
      tolerance: 10,
      preventDefault: true
    });

    // Make sure the container has proper height
    gsap.set(containerRef.current, { height: `${sectionsData.length * 100}vh` });
  };

  const wrap = (index) => {
    const length = sectionsData.length;
    return ((index % length) + length) % length;
  };

  const gotoSection = (index, direction) => {
    index = wrap(index);
    
    // Don't animate if we're already on this section
    if (index === currentIndex.current) {
      animating.current = false;
      return;
    }

    animating.current = true;

    const fromTop = direction === -1;
    const dFactor = fromTop ? -1 : 1;
    
    const tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power1.inOut" },
      onComplete: () => animating.current = false
    });

    // Animate out current section
    if (currentIndex.current >= 0) {
      gsap.set(sectionsRef.current[currentIndex.current], { zIndex: 0 });
      tl.to(imagesRef.current[currentIndex.current], { yPercent: -15 * dFactor })
        .set(sectionsRef.current[currentIndex.current], { autoAlpha: 0 });
    }

    // Animate in new section
    gsap.set(sectionsRef.current[index], { autoAlpha: 1, zIndex: 10 });
    
    tl.fromTo([outerWrappersRef.current[index], innerWrappersRef.current[index]], 
      { 
        yPercent: i => i ? -100 * dFactor : 100 * dFactor
      }, 
      { 
        yPercent: 0 
      }, 0)
      .fromTo(imagesRef.current[index], 
        { yPercent: 15 * dFactor }, 
        { yPercent: 0 }, 0);

    // Animate text if split text exists
    if (splitHeadings.current[index]) {
      tl.fromTo(splitHeadings.current[index].chars, 
        { 
          autoAlpha: 0, 
          yPercent: 150 * dFactor
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: "power2",
          stagger: {
            each: 0.02,
            from: "random"
          }
        }, 0.2);
    }

    currentIndex.current = index;
  };

  const addToRefs = (element, refArray) => {
    if (element && !refArray.current.includes(element)) {
      refArray.current.push(element);
    }
  };

  return (
    <div ref={componentRef} className="animated-sections-container">
      <div ref={containerRef} className="relative">
        {sectionsData.map((section, index) => (
          <section
            key={index}
            className={`animated-section ${section.className}`}
            ref={el => addToRefs(el, sectionsRef)}
          >
            <div 
              className="outer" 
              ref={el => addToRefs(el, outerWrappersRef)}
            >
              <div 
                className="inner"
                ref={el => addToRefs(el, innerWrappersRef)}
              >
                <div 
                  className="bg"
                  ref={el => addToRefs(el, imagesRef)}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.1) 100%), url(${section.bgImage})`
                  }}
                >
                  <h2 
                    className="section-heading"
                    ref={el => addToRefs(el, headingsRef)}
                  >
                    {section.heading}
                  </h2>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default AnimatedSections;