"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Noir7TextAnimation = ({text, fontSize , color, backgroundColor }: { text: string; fontSize: string; color: string; backgroundColor: string }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const charsRef = useRef([]);

    // The text to animate
    // const text = "NOIR7";

    useEffect(() => {
        if (!containerRef.current || !textRef.current) return;

        // Split text into characters
        const chars = text.split('');
        textRef.current.innerHTML = '';

        charsRef.current = chars.map((char, index) => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char === ' ' ? '\u00A0' : char;
            charSpan.style.display = 'inline-block';
            charSpan.style.opacity = '0';
            charSpan.style.transform = 'translateY(100%)';
            charSpan.style.willChange = 'transform, opacity';
            textRef.current.appendChild(charSpan);
            return charSpan;
        });

        // Create the animation timeline
        const tl = gsap.timeline({
            delay: 0.5,
            repeat: -1,
            repeatDelay: 2
        });

        // Stagger animation for each character
        tl.to(charsRef.current, {
            duration: 0.8,
            y: '0%',
            opacity: 1,
            ease: 'power4.out',
            stagger: {
                each: 0.1,
                from: 'start'
            }
        })
            .to(charsRef.current, {
                duration: 0.6,
                y: '-100%',
                opacity: 0,
                ease: 'power4.in',
                stagger: {
                    each: 0.05,
                    from: 'end'
                }
            }, '+=1');

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="noir7-animation"
            style={{
                fontFamily: '"PP Neue Montreal", sans-serif',
                fontWeight: 700,
                fontSize: fontSize,
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'auto', // Changed from 100vh to auto for footer
                backgroundColor: backgroundColor, // Now uses the prop
                position: 'relative',
                overflow: 'hidden',
                padding: '2rem 0' // Added some padding
            }}
        >
            {/* Animated noise effect */}
            <div
                style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'transparent url("http://assets.iceable.com/img/noise-transparent.png") repeat 0 0',
                    backgroundSize: '300px 300px',
                    animation: 'noise-animation 0.3s steps(5) infinite',
                    opacity: '0.9',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
            />

            {/* Dust/Scratches overlay */}
            {/* <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("https://img.freepik.com/premium-photo/white-dust-scratches-black-background_279525-2.jpg?w=640")',
          backgroundRepeat: 'repeat',
          opacity: '0.5',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 2
        }}
      /> */}

            {/* Text container */}
            <div
                ref={textRef}
                style={{
                    position: 'relative',
                    zIndex: 3,
                    display: 'flex'
                }}
            />
        </div>
    );
};

export default Noir7TextAnimation;