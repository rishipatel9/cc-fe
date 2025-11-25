"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ScrollRevealComponent = () => {
  const componentRef = useRef(null);

  // Register GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Initialize animations
  useEffect(() => {
    if (!componentRef.current) return;

    const animateFrom = (elem: HTMLElement, direction: number = 1) => {
      let x = 0;
      let y = direction * 100;
      
      if (elem.classList.contains("gs_reveal_fromLeft")) {
        x = -100;
        y = 0;
      } else if (elem.classList.contains("gs_reveal_fromRight")) {
        x = 100;
        y = 0;
      }
      
      gsap.fromTo(elem, 
        { x: x, y: y, autoAlpha: 0 },
        {
          duration: 1.25, 
          x: 0,
          y: 0, 
          autoAlpha: 1, 
          ease: "expo", 
          overwrite: "auto"
        }
      );
    };

    const hide = (elem: HTMLElement) => {
      gsap.set(elem, { autoAlpha: 0 });
    };

    // Get all reveal elements
    const revealElements = gsap.utils.toArray(".gs_reveal") as HTMLElement[];
    
    revealElements.forEach((elem) => {
      hide(elem); // Ensure element is hidden when scrolled into view
      
      ScrollTrigger.create({
        trigger: elem,
        scroller: "[data-scroll-container]",
        start:"top bottom",
        // markers: true, // Uncomment for debugging
        onEnter: () => animateFrom(elem),
        onEnterBack: () => animateFrom(elem, -1),
        onLeave: () => hide(elem)
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      id: 1,
      side: "left",
      title: "Highway Vinyl Nights",
      description: `The headlights hum along the painted lines<br>
We twist the dial till static turns to choir<br>
Your hand keeps time on the wheel and the night leans in<br>
Every mile is a chorus we have not written yet`,
      image: "https://assets.codepen.io/16327/portrait-image-14.jpg"
    },
    {
      id: 2,
      side: "right",
      title: "Last Diner on Route 9",
      description: `The coffee tastes like rainwater and luck<br>
Neon flickers slow while the jukebox spins a waltz<br>
We carve our names in steam on the window glass<br>
Stay till sunrise and the road will wait its turn`,
      image: "https://assets.codepen.io/16327/portrait-image-4.jpg"
    },
    {
      id: 3,
      side: "left",
      title: "Stardust Ballroom",
      description: `Mirror tiles catch every hopeful face<br>
Records spin thin silver threads through the dark<br>
We move like planets pulled by quiet drums<br>
Hold the beat and the night will never close`,
      image: "https://assets.codepen.io/16327/portrait-image-3.jpg"
    },
    {
      id: 4,
      side: "right",
      title: "Sky Without Borders",
      description: `Lay your worries down beneath the porchlight glow<br>
The crickets stitch soft rhythm in the grass<br>
We trade small dreams and make them loud together<br>
A sky without borders is waiting past the trees`,
      image: "https://assets.codepen.io/16327/portrait-image-1.jpg"
    }
  ];

  return (
    <div className="content" ref={componentRef}>
      {/* Hero Section */}
      <div className="content__hero">
        <h1 className="content__heading gs_reveal">
          Reveal animations based on scroll direction
        </h1>
      </div>

      {/* Features Grid */}
      <div className="features">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`features__item features__item--${feature.side} gs_reveal gs_reveal_from${feature.side === 'left' ? 'Left' : 'Right'}`}
          >
            <div className="features__image">
              <div className="features__card">
                <img 
                  className="features__img" 
                  src={feature.image} 
                  alt={feature.title}
                />
              </div>
            </div>
            
            <div className="features__content">
              <h2 className="features__title gs_reveal">{feature.title}</h2>
              <p 
                className="features__description gs_reveal"
                dangerouslySetInnerHTML={{ __html: feature.description }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollRevealComponent;