"use client"
import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';

// Register GSAP plugins
gsap.registerPlugin(Flip, CustomEase);

// Create custom ease animations
CustomEase.create("customEase", "0.6, 0.01, 0.05, 1");
CustomEase.create("directionalEase", "0.16, 1, 0.3, 1");
CustomEase.create("smoothBlur", "0.25, 0.1, 0.25, 1");
CustomEase.create("gentleIn", "0.38, 0.005, 0.215, 1");

const AnimationComponent = () => {
  const containerRef = useRef(null);
  const mainTlRef = useRef(null);
  const restartBtnRef = useRef(null);

  // Initial zoom level for all images
  const INITIAL_ZOOM = 1.2;

  // Function to get grid column positions
  const getGridPositions = () => {
    const gridOverlay = document.querySelector(".grid-overlay-inner");
    const columns = gridOverlay.querySelectorAll(".grid-column");

    // Make grid temporarily visible to get accurate measurements
    gsap.set(".grid-overlay", { opacity: 1 });

    // Get all column positions
    const columnPositions = Array.from(columns).map((col) => {
      const rect = col.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
        center: rect.left + rect.width / 2
      };
    });

    // Hide grid again
    gsap.set(".grid-overlay", { opacity: 0 });

    return {
      firstColumnLeft: columnPositions[0].left,
      lastColumnRight: columnPositions[columnPositions.length - 1].right,
      column7Left: columnPositions[6].left,
      columnPositions: columnPositions,
      padding: parseInt(window.getComputedStyle(gridOverlay).paddingLeft)
    };
  };

  // Function to position text elements based on container position
  const positionTextElements = () => {
    const container = document.querySelector(".preloader-container");
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const textVE = document.querySelector("#text-ve");
    const textLA = document.querySelector("#text-la");

    if (textVE) {
      gsap.set(textVE, {
        left: containerRect.left - 80 + "px"
      });
    }

    if (textLA) {
      gsap.set(textLA, {
        left: containerRect.right + 20 + "px"
      });
    }
  };

  // Function to align header elements to grid
  const alignHeaderToGrid = (gridPositions) => {
    const headerLeft = document.querySelector(".header-left");
    const headerMiddle = document.querySelector(".header-middle");
    const headerRight = document.querySelector(".header-right");

    if (headerLeft) {
      gsap.set(headerLeft, {
        position: "absolute",
        left: gridPositions.firstColumnLeft + "px"
      });
    }

    if (headerMiddle) {
      gsap.set(headerMiddle, {
        position: "absolute",
        left: gridPositions.column7Left + "px"
      });
    }

    if (headerRight) {
      gsap.set(headerRight, {
        position: "absolute",
        right: window.innerWidth - gridPositions.lastColumnRight + "px"
      });
    }
  };

  // Function to reset everything to initial state
  const resetToInitialState = () => {
    // Reset container
    gsap.set(".preloader-container", {
      width: "400px",
      height: "300px",
      position: "relative",
      overflow: "hidden"
    });

    // Reset text elements
    gsap.set(".text-element", {
      fontSize: "5rem",
      top: "50%",
      transform: "translateY(-50%)"
    });

    // Reset big title
    gsap.set(".big-title", { opacity: 0 });
    gsap.set(".title-line span", { y: "100%" });

    // Reset grid overlay
    gsap.set(".grid-overlay", {
      opacity: 0
    });

    gsap.set(".grid-column", {
      borderLeftColor: "rgba(255, 255, 255, 0)",
      borderRightColor: "rgba(255, 255, 255, 0)"
    });

    // Reset header and footer
    gsap.set(".header-left", { opacity: 0, transform: "translateY(-20px)" });
    gsap.set(".header-middle", { opacity: 0, transform: "translateY(-20px)" });
    gsap.set(".social-links", { opacity: 0, transform: "translateY(-20px)" });
    gsap.set(".footer", { transform: "translateY(100%)" });

    // Get all wrappers and images
    const wrappers = document.querySelectorAll(".image-wrapper");
    const images = document.querySelectorAll(".image-wrapper img");

    // Reset all wrappers to initial state
    gsap.set(wrappers, {
      visibility: "visible",
      clipPath: "inset(100% 0 0 0)",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      xPercent: 0,
      yPercent: 0,
      clearProps: "transform,transformOrigin"
    });

    // Reset all images with initial zoom
    gsap.set(images, {
      scale: INITIAL_ZOOM,
      transformOrigin: "center center",
      clearProps: "width,height"
    });

    // Position text elements based on container position
    positionTextElements();
  };

  // Function to initialize the animation
  const initAnimation = () => {
    // Kill any existing timeline
    if (mainTlRef.current) mainTlRef.current.kill();

    // Reset button
    gsap.set(".restart-btn", { opacity: 0, pointerEvents: "none" });

    // Reset body to center the container
    gsap.set("body", {
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    });

    // Reset everything to initial state
    resetToInitialState();

    // Get references to elements
    const wrappers = document.querySelectorAll(".image-wrapper");
    const finalWrapper = document.querySelector("#final-image");
    const finalImage = finalWrapper?.querySelector("img");
    const textVE = document.querySelector("#text-ve");
    const textLA = document.querySelector("#text-la");
    const gridColumns = document.querySelectorAll(".grid-column");
    const headerLeft = document.querySelector(".header-left");
    const headerMiddle = document.querySelector(".header-middle");
    const socialLinks = document.querySelector(".social-links");
    const titleLines = document.querySelectorAll(".title-line span");

    // Create a new timeline
    mainTlRef.current = gsap.timeline();

    // PHASE 1: Fast image loading sequence
    wrappers.forEach((wrapper, index) => {
      if (index > 0) {
        mainTlRef.current.add("image" + index, "<0.15");
      }

      mainTlRef.current.to(
        wrapper,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.65,
          ease: "smoothBlur"
        },
        index > 0 ? "image" + index : 0
      );
    });

    // Add a slight pause before the zoom animation
    mainTlRef.current.add("pauseBeforeZoom", ">0.2");

    // PHASE 2: Slower zoom and text animation
    mainTlRef.current.add("finalAnimation", "pauseBeforeZoom");

    // Get grid positions for text alignment
    const gridPositions = getGridPositions();

    // Align header elements to grid
    alignHeaderToGrid(gridPositions);

    // Get the padding value
    const padding = gridPositions.padding;

    // Store the initial position of LA for FLIP animation
    const laElement = document.querySelector("#text-la");
    const laInitialState = laElement ? Flip.getState(laElement) : null;

    // Animate the final image - SLOWER
    mainTlRef.current.add(() => {
      if (!finalWrapper || !finalImage) return;

      const state = Flip.getState(finalWrapper);

      // Remove overflow hidden to allow expansion
      gsap.set(".preloader-container", { overflow: "visible" });

      // Position the final wrapper to cover the viewport
      gsap.set(finalWrapper, {
        position: "fixed",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        width: "100dvw",
        height: "100dvh"
      });

      // Use FLIP to animate the container expansion - SLOWER
      Flip.from(state, {
        duration: 1.2,
        ease: "customEase",
        absolute: true
      });

      // Simultaneously animate the image scale from 1.2 to 1.0 - SLOWER
      gsap.to(finalImage, {
        scale: 1.0,
        duration: 1.2,
        ease: "customEase"
      });
    }, "finalAnimation");

    // Animate VE to the padding position - SLOWER
    if (textVE) {
      mainTlRef.current.to(
        textVE,
        {
          left: padding + "px",
          fontSize: "3rem",
          duration: 1.2,
          ease: "directionalEase"
        },
        "finalAnimation"
      );
    }

    // For LA, use FLIP to ensure smooth animation - SLOWER
    if (laElement && laInitialState) {
      mainTlRef.current.add(() => {
        // Set LA's final position - right aligned with padding
        gsap.set(laElement, {
          left: "auto",
          right: padding + "px",
          fontSize: "3rem"
        });

        // Use FLIP to animate from initial to final position - SLOWER
        Flip.from(laInitialState, {
          duration: 1.2,
          ease: "directionalEase",
          absolute: true
        });
      }, "finalAnimation");
    }

    // Add a slight pause after the zoom animation
    mainTlRef.current.add("pauseAfterZoom", ">0.3");

    // PHASE 3: Faster grid, header, footer, and title animations
    mainTlRef.current.add("gridReveal", "pauseAfterZoom");

    // Show the grid overlay
    mainTlRef.current.to(
      ".grid-overlay",
      {
        opacity: 1,
        duration: 0.4,
        ease: "gentleIn"
      },
      "gridReveal"
    );

    // Stagger animate the grid columns with faster stagger
    mainTlRef.current.to(
      ".grid-column",
      {
        borderLeftColor: "rgba(255, 255, 255, 0.2)",
        borderRightColor: "rgba(255, 255, 255, 0.2)",
        duration: 0.6,
        stagger: 0.08,
        ease: "gentleIn"
      },
      "gridReveal"
    );

    // Add header and footer animation with staggered elements
    mainTlRef.current.add("headerFooter", ">-0.3");

    // Stagger animate header elements
    if (headerLeft) {
      mainTlRef.current.to(
        headerLeft,
        {
          opacity: 1,
          transform: "translateY(0)",
          duration: 0.6,
          ease: "directionalEase"
        },
        "headerFooter"
      );
    }

    if (headerMiddle) {
      mainTlRef.current.to(
        headerMiddle,
        {
          opacity: 1,
          transform: "translateY(0)",
          duration: 0.6,
          ease: "directionalEase",
          delay: 0.15
        },
        "headerFooter"
      );
    }

    if (socialLinks) {
      mainTlRef.current.to(
        socialLinks,
        {
          opacity: 1,
          transform: "translateY(0)",
          duration: 0.6,
          ease: "directionalEase",
          delay: 0.3
        },
        "headerFooter"
      );
    }

    // Animate footer
    mainTlRef.current.to(
      ".footer",
      {
        transform: "translateY(0)",
        duration: 0.7,
        ease: "directionalEase"
      },
      "headerFooter+=0.4"
    );

    // Add big title animation
    mainTlRef.current.add("titleReveal", ">-0.2");

    // Make title visible
    mainTlRef.current.to(
      ".big-title",
      {
        opacity: 1,
        duration: 0.3
      },
      "titleReveal"
    );

    // Animate each line of the title
    if (titleLines.length > 0) {
      mainTlRef.current.to(
        titleLines,
        {
          y: "0%",
          duration: 0.9,
          stagger: 0.15,
          ease: "customEase",
          onComplete: () => {
            // Show the restart button
            gsap.to(".restart-btn", {
              opacity: 1,
              duration: 0.4,
              pointerEvents: "auto"
            });
          }
        },
        "titleReveal+=0.1"
      );
    }

    return mainTlRef.current;
  };

  // Handle restart button click
  const handleRestart = () => {
    initAnimation();
  };

  // Handle window resize
  const handleResize = () => {
    if (!mainTlRef.current || mainTlRef.current.progress() === 0) {
      positionTextElements();
      const gridPositions = getGridPositions();
      alignHeaderToGrid(gridPositions);
    }
  };

  useEffect(() => {
    // Prevent any layout shifts during animation
    gsap.config({
      force3D: true
    });

    // Initialize animation on component mount
    const timer = setTimeout(() => {
      initAnimation();
    }, 100);

    // Add event listeners
    window.addEventListener('resize', handleResize);
    if (restartBtnRef.current) {
      restartBtnRef.current.addEventListener('click', handleRestart);
    }

    // Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (restartBtnRef.current) {
        restartBtnRef.current.removeEventListener('click', handleRestart);
      }
      if (mainTlRef.current) {
        mainTlRef.current.kill();
      }
    };
  }, []);

  return (
    <div ref={containerRef}>
      {/* Restart Button */}
      <button className="restart-btn" ref={restartBtnRef}>
        <div className="dot-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </button>

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-left">SPICE MERIDIAN</div>
          <div className="header-middle">
            <a href="#" className="nav-link">VOYAGES</a>
            <a href="#" className="nav-link">ARCHIVES</a>
          </div>
          <div className="header-right">
            <div className="social-links">
              <a href="#">IG</a>
              <a href="#">IN</a>
            </div>
          </div>
        </div>
      </header>

      {/* Text Elements */}
      <div className="text-element" id="text-ve">VE</div>

      {/* Preloader Container */}
      <div className="preloader-container">
        <div className="image-wrapper">
          <img src="https://cdn.cosmos.so/5f8d5539-943c-4df5-bae8-8e714633ddd0.jpeg" alt="Image 1" />
        </div>
        <div className="image-wrapper">
          <img src="https://cdn.cosmos.so/0098a074-f8a2-4821-bcb0-433c093ae255.jpeg" alt="Image 2" />
        </div>
        <div className="image-wrapper">
          <img src="https://cdn.cosmos.so/ce9f9fd7-a2a5-476d-9757-481ca01b5861.jpeg" alt="Image 3" />
        </div>
        <div className="image-wrapper" id="final-image">
          <img src="https://cdn.cosmos.so/94579ea4-daee-43f9-b778-84156b731361.jpeg" alt="Image 4" />
        </div>
      </div>

      <div className="text-element" id="text-la">LA</div>

      {/* Big Title */}
      <div className="big-title">
        <div className="title-line"><span>CELESTIAL</span></div>
        <div className="title-line"><span>SANDS OF</span></div>
        <div className="title-line"><span>ETERNITY</span></div>
      </div>

      {/* Grid Overlay */}
      <div className="grid-overlay">
        <div className="grid-overlay-inner">
          <div className="grid-column"></div>
          <div className="grid-column"></div>
          <div className="grid-column"></div>
          <div className="grid-column"></div>
          <div className="grid-column"></div>
          <div className="grid-column"></div>
          <div className="grid-column"></div>
          <div className="grid-column"></div>
          <div className="grid-column"></div>
          <div className="grid-column"></div>
          <div className="grid-column"></div>
          <div className="grid-column"></div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="coordinates">51.5074° N, 0.1278° W</div>
      </footer>

      <style jsx>{`
        @font-face {
          src: url("https://fonts.cdnfonts.com/css/pp-neue-montreal") format("woff2");
          font-family: "PP Neue Montreal", sans-serif;
          font-weight: 400;
        }

        *,
        *:before,
        *:after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          font-size: calc(100vw / 1512 * 10);
        }

        body {
          font-family: "PP Neue Montreal", sans-serif;
          font-weight: 500;
          font-size: 1.8rem;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow: hidden;
          background-color: #f5f5f5;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        /* Background noise effect */
        body::before {
          content: "";
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: transparent
            url("http://assets.iceable.com/img/noise-transparent.png") repeat 0 0;
          background-size: 300px 300px;
          animation: noise-animation 0.3s steps(5) infinite;
          opacity: 0.03;
          will-change: transform;
          z-index: 100;
          pointer-events: none;
        }

        @keyframes noise-animation {
          0% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(-2%, -3%);
          }
          20% {
            transform: translate(-4%, 2%);
          }
          30% {
            transform: translate(2%, -4%);
          }
          40% {
            transform: translate(-2%, 5%);
          }
          50% {
            transform: translate(-4%, 2%);
          }
          60% {
            transform: translate(3%, 0);
          }
          70% {
            transform: translate(0, 3%);
          }
          80% {
            transform: translate(-3%, 0);
          }
          90% {
            transform: translate(2%, 2%);
          }
          100% {
            transform: translate(1%, 0);
          }
        }

        .preloader-container {
          position: relative;
          width: 400px;
          height: 300px;
          overflow: hidden;
          z-index: 5;
        }

        .image-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          visibility: hidden;
        }

        .image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform-origin: center center;
        }

        /* Final image special handling */
        #final-image {
          z-index: 10;
        }

        /* Text elements */
        .text-element {
          position: fixed;
          font-size: 5rem;
          font-weight: 700;
          color: white;
          z-index: 20;
          top: 50%;
          transform: translateY(-50%);
          letter-spacing: -0.02em;
        }

        /* Big title */
        .big-title {
          position: fixed;
          bottom: 5%;
          left: 2rem;
          color: white;
          z-index: 25;
          font-weight: 700;
          font-size: clamp(2.5rem, 14vh, 12rem);
          letter-spacing: -0.02em;
          line-height: 0.9;
          opacity: 0;
        }

        .title-line {
          overflow: hidden;
          height: 10rem;
        }

        .title-line span {
          display: block;
          transform: translateY(100%);
        }

        /* Grid overlay */
        .grid-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100dvw;
          height: 100dvh;
          z-index: 5;
          pointer-events: none;
          opacity: 0;
        }

        .grid-overlay-inner {
          width: 100%;
          height: 100%;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
        }

        .grid-column {
          flex: 1;
          height: 100%;
          border-left: 1px solid rgba(255, 255, 255, 0);
          border-right: 1px solid rgba(255, 255, 255, 0);
          margin: 0 0.5rem;
        }

        .grid-column:first-child {
          margin-left: 0;
        }

        .grid-column:last-child {
          margin-right: 0;
        }

        /* Header */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 2rem 0;
          z-index: 50;
          font-size: 1.75rem;
          letter-spacing: -0.02em;
          color: white;
        }

        .header-inner {
          width: 100%;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
        }

        .header-left {
          font-weight: 700;
          opacity: 0;
          transform: translateY(-20px);
        }

        .header-middle {
          display: flex;
          gap: 3rem;
          opacity: 0;
          transform: translateY(-20px);
        }

        .header-right {
          display: flex;
          gap: 2rem;
        }

        .social-links {
          opacity: 0;
          transform: translateY(-20px);
          font-weight: 500;
        }

        .header a {
          color: inherit;
          text-decoration: none;
          font-weight: 700;
        }

        /* Footer */
        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 50;
          font-size: 1.2rem;
          letter-spacing: -0.02em;
          color: white;
          transform: translateY(100%);
        }

        .coordinates {
          font-weight: 500;
          opacity: 0.8;
        }

        /* Dot icon restart button */
        .restart-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 30px;
          height: 30px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 60;
          opacity: 0;
          pointer-events: none;
          transition: transform 0.3s ease;
        }

        .restart-btn:hover {
          transform: rotate(45deg);
        }

        .dot-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 4px;
          transition: transform 0.3s ease;
        }

        .dot {
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%;
          margin: auto;
        }
      `}</style>
    </div>
  );
};

export default AnimationComponent;