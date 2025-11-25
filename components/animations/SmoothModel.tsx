"use client"
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const SmoothModal = ({ children, formContent }) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);
  const openModalRef = useRef(null);
  const spanRef = useRef(null);
  const nextRef = useRef(null);
  const closeModalRef = useRef(null);
  const timelineRef = useRef(null);

  const baseWidth = 50;

  const scaledValue = () => {
    let windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (windowHeight > windowWidth) {
      windowWidth = windowHeight;
    }
    const toScale = windowWidth / baseWidth + 10;
    return Math.ceil(toScale);
  };

  useEffect(() => {
    // Initialize GSAP timeline
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => setIsVisible(true),
      onReverseComplete: () => setIsVisible(false)
    });

    tl.to(spanRef.current, { opacity: 0, duration: 0.25 })
      .to(openModalRef.current, { width: baseWidth })
      .to(nextRef.current, { scale: scaledValue() })
      .to(modalRef.current, { autoAlpha: 1 });

    timelineRef.current = tl;

    // Handle window resize
    const handleResize = () => {
      if (isVisible) {
        gsap.to(nextRef.current, { scale: scaledValue() });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isVisible]);

  const handleOpen = () => {
    if (timelineRef.current) {
      timelineRef.current.play();
    }
  };

  const handleClose = () => {
    if (timelineRef.current) {
      timelineRef.current.reverse();
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Escape' && isVisible) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isVisible]);

  return (
    <>
      <div className="wrapper relative">
        <button 
          ref={openModalRef}
          className="open-modal relative block w-48 h-[50px] bg-black text-white rounded-[30px] font-bold z-10"
          onClick={handleOpen}
        >
          <span ref={spanRef} className="text-white">
            {children}
          </span>
        </button>
        <div 
          ref={nextRef}
          className="next absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50px] aspect-square bg-black rounded-full"
        />
      </div>

      <div 
        ref={modalRef}
        className="modal fixed inset-0 bg-black text-white items-center justify-center invisible opacity-0 z-20"
      >
        <div className="modal-dialog flex w-full h-screen overflow-auto">
          <button 
            ref={closeModalRef}
            className="close-modal absolute top-8 right-8 text-2xl z-30"
            onClick={handleClose}
            aria-label="close modal"
            title="close modal"
          >
            ✕
          </button>
          
          <section className="modal-content max-w-md w-full p-8 mx-auto my-auto">
            {formContent || (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 bg-transparent border border-white/30 rounded-md text-white focus:outline-none focus:border-white"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 bg-transparent border border-white/30 rounded-md text-white focus:outline-none focus:border-white"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="w-full px-3 py-2 bg-transparent border border-white/30 rounded-md text-white focus:outline-none focus:border-white resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-white text-black py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </form>
                
                <div className="text-center text-white/60 text-sm mt-6">
                  <p>Press ✕ or ESC to close</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default SmoothModal;