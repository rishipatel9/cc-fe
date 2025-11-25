"use client";
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);
CustomEase.create("customEase", "M0,0 C0.86,0 0.07,1 1,1");

// Sound Manager Class
class SoundManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = false;
    this.init();
  }

  init() {
    this.loadSound("hover", "https://assets.codepen.io/7558/click-reverb-001.mp3");
    this.loadSound("click", "https://assets.codepen.io/7558/shutter-fx-001.mp3");
    this.loadSound("textChange", "https://assets.codepen.io/7558/whoosh-fx-001.mp3");
  }

  loadSound(name, url) {
    const audio = new Audio(url);
    audio.preload = "auto";
    if (name === "hover") {
      audio.volume = 0.15;
    } else {
      audio.volume = 0.3;
    }
    this.sounds[name] = audio;
  }

  enableAudio() {
    if (!this.isEnabled) {
      this.isEnabled = true;
    }
  }

  play(soundName, delay = 0) {
    if (this.isEnabled && this.sounds[soundName]) {
      if (delay > 0) {
        setTimeout(() => {
          this.sounds[soundName].currentTime = 0;
          this.sounds[soundName].play().catch((e) => {
            console.log("Audio play failed:", e);
          });
        }, delay);
      } else {
        this.sounds[soundName].currentTime = 0;
        this.sounds[soundName].play().catch((e) => {
          console.log("Audio play failed:", e);
        });
      }
    }
  }

  addSound(name, url, volume = 0.3) {
    this.loadSound(name, url);
    if (this.sounds[name]) {
      this.sounds[name].volume = volume;
    }
  }
}

const CreativeProcess = () => {
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const scrollContainerRef = useRef(null);
  const loadingOverlayRef = useRef(null);
  const loadingCounterRef = useRef(null);
  const fixedContainerRef = useRef(null);
  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);
  const featuredRef = useRef(null);
  const footerRef = useRef(null);
  const progressFillRef = useRef(null);
  const currentSectionRef = useRef(null);
  const debugInfoRef = useRef(null);
  
  const lenisRef = useRef(null);
  const soundManagerRef = useRef(null);
  const splitTextsRef = useRef({});
  const isAnimatingRef = useRef(false);
  const isSnappingRef = useRef(false);
  const sectionPositionsRef = useRef([]);

  const sections = [
    { artist: "Silence", featured: "Creative Elements", category: "Reduction" },
    { artist: "Meditation", featured: "Inner Stillness", category: "Essence" },
    { artist: "Intuition", featured: "Deep Knowing", category: "Space" },
    { artist: "Authenticity", featured: "True Expression", category: "Resonance" },
    { artist: "Presence", featured: "Now Moment", category: "Truth" },
    { artist: "Listening", featured: "Deep Attention", category: "Feeling" },
    { artist: "Curiosity", featured: "Open Exploration", category: "Clarity" },
    { artist: "Patience", featured: "Calm Waiting", category: "Emptiness" },
    { artist: "Surrender", featured: "Let Go Control", category: "Awareness" },
    { artist: "Simplicity", featured: "Pure Essence", category: "Minimalism" }
  ];

  const backgroundImages = [
    "https://assets.codepen.io/7558/flame-glow-blur-001.jpg",
    "https://assets.codepen.io/7558/flame-glow-blur-002.jpg",
    "https://assets.codepen.io/7558/flame-glow-blur-003.jpg",
    "https://assets.codepen.io/7558/flame-glow-blur-004.jpg",
    "https://assets.codepen.io/7558/flame-glow-blur-005.jpg",
    "https://assets.codepen.io/7558/flame-glow-blur-006.jpg",
    "https://assets.codepen.io/7558/flame-glow-blur-007.jpg",
    "https://assets.codepen.io/7558/flame-glow-blur-008.jpg",
    "https://assets.codepen.io/7558/flame-glow-blur-009.jpg",
    "https://assets.codepen.io/7558/flame-glow-blur-010.jpg"
  ];

  useEffect(() => {
    // Initialize sound manager
    soundManagerRef.current = new SoundManager();

    // Wait for fonts to load
    document.fonts.ready.then(() => {
      initLenis();
      initPage();
    });

    return () => {
      // Cleanup
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const initLenis = () => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2
    });

    lenisRef.current.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenisRef.current.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  };

  const initPage = () => {
    // Loading animation
    const loadingCounter = loadingCounterRef.current;
    let counter = 0;
    
    const counterInterval = setInterval(() => {
      counter += Math.random() * 3 + 1;
      if (counter >= 100) {
        counter = 100;
        clearInterval(counterInterval);
        
        setTimeout(() => {
          gsap.to(loadingCounter, {
            opacity: 0,
            y: -20,
            duration: 0.6,
            ease: "power2.inOut"
          });
          
          gsap.to(loadingOverlayRef.current.childNodes[0], {
            opacity: 0,
            y: -20,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.to(loadingOverlayRef.current, {
                y: "-100%",
                duration: 1.2,
                ease: "power3.inOut",
                delay: 0.3,
                onComplete: () => {
                  setLoading(false);
                  animateColumns();
                }
              });
            }
          });
        }, 200);
      }
      if (loadingCounter) {
        loadingCounter.textContent = `[${counter.toFixed(0).padStart(2, "0")}]`;
      }
    }, 30);

    // Initialize animations
    initAnimations();
  };

  const initAnimations = () => {
    const duration = 0.64;
    const fixedContainer = fixedContainerRef.current;
    const featuredContents = document.querySelectorAll('.featured-content');
    
    // Setup SplitText for featured content
    featuredContents.forEach((content, index) => {
      const h3 = content.querySelector('h3');
      if (h3) {
        splitTextsRef.current[`featured-${index}`] = new SplitText(h3, {
          type: "words",
          wordsClass: "split-word"
        });
        
        splitTextsRef.current[`featured-${index}`].words.forEach((word) => {
          const wrapper = document.createElement("div");
          wrapper.className = "word-mask";
          wrapper.style.display = "inline-block";
          wrapper.style.overflow = "hidden";
          word.parentNode.insertBefore(wrapper, word);
          wrapper.appendChild(word);
          
          if (index !== 0) {
            gsap.set(word, {
              yPercent: 100,
              opacity: 0
            });
          } else {
            gsap.set(word, {
              yPercent: 0,
              opacity: 1
            });
          }
        });
      }
    });

    gsap.set(fixedContainer, {
      height: "100vh"
    });

    // Calculate section positions
    const fixedSectionElement = document.querySelector('.fixed-section');
    const fixedSectionTop = fixedSectionElement.offsetTop;
    const fixedSectionHeight = fixedSectionElement.offsetHeight;
    
    for (let i = 0; i < 10; i++) {
      sectionPositionsRef.current.push(fixedSectionTop + (fixedSectionHeight * i) / 10);
    }

    // Main scroll trigger
    ScrollTrigger.create({
      trigger: ".fixed-section",
      start: "top top",
      end: "bottom bottom",
      pin: ".fixed-container",
      pinSpacing: true,
      onUpdate: (self) => {
        if (isSnappingRef.current) return;
        
        const progress = self.progress;
        const targetSection = Math.min(9, Math.floor(progress * 10));
        
        if (targetSection !== currentSection && !isAnimatingRef.current) {
          const nextSection = currentSection + (targetSection > currentSection ? 1 : -1);
          snapToSection(nextSection);
        }
        
        // Update progress fill
        const sectionProgress = currentSection / 9;
        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${sectionProgress * 100}%`;
        }
        
        if (debugInfoRef.current) {
          debugInfoRef.current.textContent = `Section: ${currentSection}, Target: ${targetSection}, Progress: ${progress.toFixed(3)}`;
        }
      }
    });

    // End section scroll handling
    ScrollTrigger.create({
      trigger: ".end-section",
      start: "top center",
      end: "bottom bottom",
      onUpdate: (self) => {
        const footer = footerRef.current;
        const leftColumn = leftColumnRef.current;
        const rightColumn = rightColumnRef.current;
        const featured = featuredRef.current;
        
        if (self.progress > 0.1) {
          footer?.classList.add('blur');
          leftColumn?.classList.add('blur');
          rightColumn?.classList.add('blur');
          featured?.classList.add('blur');
        } else {
          footer?.classList.remove('blur');
          leftColumn?.classList.remove('blur');
          rightColumn?.classList.remove('blur');
          featured?.classList.remove('blur');
        }
        
        if (self.progress > 0.1) {
          const newHeight = Math.max(0, 100 - ((self.progress - 0.1) / 0.9) * 100);
          gsap.to(fixedContainer, {
            height: `${newHeight}vh`,
            duration: 0.1,
            ease: "power1.out"
          });
          
          const moveY = (-(self.progress - 0.1) / 0.9) * 200;
          gsap.to('.header', {
            y: moveY * 1.5,
            duration: 0.1,
            ease: "power1.out"
          });
          
          gsap.to('.content', {
            y: `calc(${moveY}px + (-50%))`,
            duration: 0.1,
            ease: "power1.out"
          });
          
          gsap.to(footer, {
            y: moveY * 0.5,
            duration: 0.1,
            ease: "power1.out"
          });
        } else {
          gsap.to(fixedContainer, {
            height: "100vh",
            duration: 0.1,
            ease: "power1.out"
          });
          
          gsap.to('.header', {
            y: 0,
            duration: 0.1,
            ease: "power1.out"
          });
          
          gsap.to('.content', {
            y: "-50%",
            duration: 0.1,
            ease: "power1.out"
          });
          
          gsap.to(footer, {
            y: 0,
            duration: 0.1,
            ease: "power1.out"
          });
        }
      }
    });

    // Keyboard shortcut for debug info
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'h' && debugInfoRef.current) {
        debugInfoRef.current.style.display = 
          debugInfoRef.current.style.display === 'none' ? 'block' : 'none';
      }
    });
  };

  const animateColumns = () => {
    const artistItems = document.querySelectorAll('.artist');
    const categoryItems = document.querySelectorAll('.category');
    
    artistItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('loaded');
      }, index * 60);
    });
    
    categoryItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('loaded');
      }, index * 60 + 200);
    });
  };

  const navigateToSection = (index) => {
    if (index === currentSection || isAnimatingRef.current || isSnappingRef.current) return;

    soundManagerRef.current.enableAudio();
    soundManagerRef.current.play("click");
    setAudioEnabled(true);

    isSnappingRef.current = true;
    const targetPosition = sectionPositionsRef.current[index];

    changeSection(index);

    lenisRef.current.scrollTo(targetPosition, {
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lock: true,
      onComplete: () => {
        isSnappingRef.current = false;
      }
    });
  };

  const snapToSection = (targetSection) => {
    if (targetSection < 0 || targetSection > 9 || targetSection === currentSection || isAnimatingRef.current) return;
    
    isSnappingRef.current = true;
    changeSection(targetSection);
    
    const targetPosition = sectionPositionsRef.current[targetSection];
    lenisRef.current.scrollTo(targetPosition, {
      duration: 0.6,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lock: true,
      onComplete: () => {
        isSnappingRef.current = false;
      }
    });
  };

  const changeSection = (newSection) => {
    if (newSection === currentSection || isAnimatingRef.current) return;
    
    isAnimatingRef.current = true;
    const isScrollingDown = newSection > currentSection;
    const previousSection = currentSection;
    
    setCurrentSection(newSection);

    // Update progress numbers
    if (currentSectionRef.current) {
      currentSectionRef.current.textContent = (newSection + 1).toString().padStart(2, "0");
    }

    if (progressFillRef.current) {
      const sectionProgress = newSection / 9;
      progressFillRef.current.style.width = `${sectionProgress * 100}%`;
    }

    const duration = 0.64;
    const featuredContents = document.querySelectorAll('.featured-content');
    const backgrounds = document.querySelectorAll('.background-image');
    const artists = document.querySelectorAll('.artist');
    const categories = document.querySelectorAll('.category');
    const parallaxAmount = 5;

    // Handle featured content transition
    featuredContents.forEach((content, i) => {
      if (i !== newSection && i !== previousSection) {
        content.classList.remove('active');
        gsap.set(content, {
          visibility: 'hidden',
          opacity: 0
        });
      }
    });

    if (previousSection !== null) {
      const prevWords = splitTextsRef.current[`featured-${previousSection}`]?.words;
      if (prevWords) {
        gsap.to(prevWords, {
          yPercent: isScrollingDown ? -100 : 100,
          opacity: 0,
          duration: duration * 0.6,
          stagger: isScrollingDown ? 0.03 : -0.03,
          ease: "customEase",
          onComplete: () => {
            featuredContents[previousSection].classList.remove('active');
            gsap.set(featuredContents[previousSection], {
              visibility: 'hidden'
            });
          }
        });
      }
    }

    const newWords = splitTextsRef.current[`featured-${newSection}`]?.words;
    if (newWords) {
      soundManagerRef.current.play("textChange", 250);

      featuredContents[newSection].classList.add('active');
      gsap.set(featuredContents[newSection], {
        visibility: 'visible',
        opacity: 1
      });
      
      gsap.set(newWords, {
        yPercent: isScrollingDown ? 100 : -100,
        opacity: 0
      });
      
      gsap.to(newWords, {
        yPercent: 0,
        opacity: 1,
        duration: duration,
        stagger: isScrollingDown ? 0.05 : -0.05,
        ease: "customEase"
      });
    }

    // Handle background transitions
    backgrounds.forEach((bg, i) => {
      bg.classList.remove('previous', 'active');
      
      if (i === newSection) {
        if (isScrollingDown) {
          gsap.set(bg, {
            opacity: 1,
            y: 0,
            clipPath: "inset(100% 0 0 0)"
          });
          gsap.to(bg, {
            clipPath: "inset(0% 0 0 0)",
            duration: duration,
            ease: "customEase"
          });
        } else {
          gsap.set(bg, {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 100% 0)"
          });
          gsap.to(bg, {
            clipPath: "inset(0 0 0% 0)",
            duration: duration,
            ease: "customEase"
          });
        }
        bg.classList.add('active');
      } else if (i === previousSection) {
        bg.classList.add('previous');
        gsap.to(bg, {
          y: isScrollingDown ? `${parallaxAmount}%` : `-${parallaxAmount}%`,
          duration: duration,
          ease: "customEase"
        });
        
        gsap.to(bg, {
          opacity: 0,
          delay: duration * 0.5,
          duration: duration * 0.5,
          ease: "customEase",
          onComplete: () => {
            bg.classList.remove('previous');
            gsap.set(bg, {
              y: 0
            });
            isAnimatingRef.current = false;
          }
        });
      } else {
        gsap.to(bg, {
          opacity: 0,
          duration: duration * 0.3,
          ease: "customEase"
        });
      }
    });

    // Handle artist and category transitions
    artists.forEach((artist, i) => {
      if (i === newSection) {
        artist.classList.add('active');
        gsap.to(artist, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        artist.classList.remove('active');
        gsap.to(artist, {
          opacity: 0.3,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });

    categories.forEach((category, i) => {
      if (i === newSection) {
        category.classList.add('active');
        gsap.to(category, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        category.classList.remove('active');
        gsap.to(category, {
          opacity: 0.3,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  };

  const handleArtistClick = (index, e) => {
    e.preventDefault();
    navigateToSection(index);
  };

  const handleCategoryClick = (index, e) => {
    e.preventDefault();
    navigateToSection(index);
  };

  const handleHover = () => {
    soundManagerRef.current.enableAudio();
    soundManagerRef.current.play("hover");
    setAudioEnabled(true);
  };

  const toggleAudio = () => {
    if (audioEnabled) {
      soundManagerRef.current.isEnabled = false;
      setAudioEnabled(false);
    } else {
      soundManagerRef.current.enableAudio();
      setAudioEnabled(true);
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay" id="loading-overlay" ref={loadingOverlayRef}>
          Loading <span className="loading-counter" id="loading-counter" ref={loadingCounterRef}>[00]</span>
        </div>
      )}
      
      <div className="debug-info" id="debug-info" ref={debugInfoRef}>
        Current Section: {currentSection}
      </div>

      <button 
        className={`sound-toggle ${!audioEnabled ? 'disabled' : ''}`}
        onClick={toggleAudio}
        aria-label={audioEnabled ? "Disable sound" : "Enable sound"}
      >
        <div className="sound-dots">
          <div className={`sound-dot ${audioEnabled ? 'animated' : ''}`}></div>
          <div className={`sound-dot ${audioEnabled ? 'animated' : ''}`}></div>
          <div className={`sound-dot ${audioEnabled ? 'animated' : ''}`}></div>
          <div className={`sound-dot ${audioEnabled ? 'animated' : ''}`}></div>
        </div>
      </button>

      <div className="scroll-container" id="scroll-container" ref={scrollContainerRef}>
        <div className="fixed-section" id="fixed-section">
          <div className="fixed-container" id="fixed-container" ref={fixedContainerRef}>
            <div className="background-container" id="background-container">
              {backgroundImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Background ${index + 1}`}
                  className={`background-image ${index === currentSection ? 'active' : ''}`}
                  id={`background-${index + 1}`}
                />
              ))}
            </div>
            
            <div className="grid-container">
              <div className="header">
                <div className="header-row">The Creative</div>
                <div className="header-row">Process</div>
              </div>
              
              <div className="content">
                <div className="left-column" id="left-column" ref={leftColumnRef}>
                  {sections.map((section, index) => (
                    <div
                      key={index}
                      className={`artist ${index === currentSection ? 'active' : ''}`}
                      id={`artist-${index}`}
                      data-index={index}
                      onClick={(e) => handleArtistClick(index, e)}
                      onMouseEnter={handleHover}
                    >
                      {section.artist}
                    </div>
                  ))}
                </div>
                
                <div className="featured" id="featured" ref={featuredRef}>
                  {sections.map((section, index) => (
                    <div
                      key={index}
                      className={`featured-content ${index === currentSection ? 'active' : ''}`}
                      id={`featured-${index}`}
                      data-index={index}
                    >
                      <h3>{section.featured}</h3>
                    </div>
                  ))}
                </div>
                
                <div className="right-column" id="right-column" ref={rightColumnRef}>
                  {sections.map((section, index) => (
                    <div
                      key={index}
                      className={`category ${index === currentSection ? 'active' : ''}`}
                      id={`category-${index}`}
                      data-index={index}
                      onClick={(e) => handleCategoryClick(index, e)}
                      onMouseEnter={handleHover}
                    >
                      {section.category}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="footer" id="footer" ref={footerRef}>
                <div className="header-row">Beyond</div>
                <div className="header-row">Thinking</div>
                <div className="progress-indicator">
                  <div className="progress-numbers">
                    <span id="current-section" ref={currentSectionRef}>
                      {(currentSection + 1).toString().padStart(2, "0")}
                    </span>
                    <span id="total-sections">10</span>
                  </div>
                  <div className="progress-fill" id="progress-fill" ref={progressFillRef}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="end-section">
          <p className="fin">fin</p>
        </div>
      </div>
    </>
  );
};

export default CreativeProcess;