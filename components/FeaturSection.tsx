"use client";
import React, { useState, useRef, useEffect } from 'react';
import { SmoothCursor } from "@/components/ui/smooth-cursor"

interface CardProps {
  color: string;
  title: string;
  subtitle: string;
  description: string | null;
  icon: string;
  index: number;
  totalCards: number;
  activeIndex: number;
  dragOffset: number;
}

const Card = ({ color, title, subtitle, description, icon, index, totalCards, activeIndex, dragOffset }: CardProps) => {
  const getPositionStyle = () => {
    const positions = [
      { x: -55, y: 15, rotate: -15, scale: 0.7, z: 1, opacity: 0.5 },
      { x: 0, y: 0, rotate: 0, scale: 1, z: 3, opacity: 1 },
      { x: 55, y: 15, rotate: 15, scale: 0.7, z: 1, opacity: 0.5 }
    ];

    let relativeIndex = (index - activeIndex + totalCards) % totalCards;
    
    if (relativeIndex > totalCards / 2) {
      relativeIndex -= totalCards;
    }
    
    let posStyle;
    if (relativeIndex === -1) {
      posStyle = positions[0];
    } else if (relativeIndex === 0) {
      posStyle = positions[1];
    } else if (relativeIndex === 1) {
      posStyle = positions[2];
    } else {
      posStyle = { x: 0, y: 0, rotate: 0, scale: 0, z: 0, opacity: 0 };
    }

    const adjustedX = posStyle.x + (dragOffset * 0.1);

    return { ...posStyle, x: adjustedX };
  };

  const posStyle = getPositionStyle();

  return (
    <div
      className="absolute transition-all ease-out w-full h-full flex items-center justify-center"
      style={{
        transform: `translateX(${posStyle.x}%) rotate(${posStyle.rotate}deg) scale(${posStyle.scale})`,
        zIndex: posStyle.z,
        opacity: posStyle.opacity,
        pointerEvents: posStyle.z === 3 ? 'auto' : 'none',
        transitionDuration: dragOffset !== 0 ? '0ms' : '700ms'
      }}
    >
      <div 
        className="w-full h-full max-w-sm max-h-[450px] rounded-3xl shadow-2xl overflow-hidden select-none"
        style={{ 
          background: color,
          boxShadow: posStyle.z === 3
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
            : '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div className="p-6 h-full flex flex-col justify-between relative">
          <div className="text-white/60 text-xs tracking-widest uppercase">
            Part of the Membership
          </div>
          
          <div className="absolute top-6 right-6 text-white text-3xl">
            {icon}
          </div>
          
          <div className="flex-1 flex items-center">
            <div>
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-3 leading-tight">
                {title}
              </h2>
              <p className="text-white/80 text-sm md:text-base">
                {subtitle}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-3">
            {description && (
              <div className="bg-black/20 rounded-xl overflow-hidden flex-1">
                <img 
                  src="data:image/svg+xml,%3Csvg width='240' height='140' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='240' height='140' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23666' text-anchor='middle' dominant-baseline='middle'%3EPreview%3C/text%3E%3C/svg%3E"
                  alt="Preview"
                  className="w-full h-24 object-cover"
                />
              </div>
            )}
            <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-colors whitespace-nowrap">
              Discover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const cards = [
    {
      color: '#b0ea1d',
      title: 'CarbonCalculator',
      subtitle: 'Built on GHG Protocol and ISO 14064, with outputs mapped to SECR (UK), CSRD (EU), and SEC (US) disclosure formats.',
      icon: '✱',
      description: null
    },
    {
      color: '#6c5f31',
      title: 'CarbonLive (Entreprise API)',
      subtitle: 'Direct API integration for agencies, DSPs, SSPs, and ad exchanges — embedding CarbonCut into existing marketing and reporting workflows.',
      icon: '✱',
      description: 'Dashboard Preview'
    },
    {
      color: '#F0db18',
      title: 'CarbonOffset',
      subtitle: 'Neutralise residual tonnes through a curated global marketplace of verified projects — including Verra, Gold Standard, ACR, and CAR.',
      icon: '✱',
      description: null
    },
    {
      color: '#e0ddcf',
      title: 'CarbonESG (Live Dashboard)',
      subtitle: 'A centralized, multi-user ESG platform to transform campaign data into audit-ready disclosures in SECR, CSRD, and SEC formats.',
      icon: '✱',
      description: null
    }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const diff = e.clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = 50;
    
    if (dragOffset < -threshold) {
      setActiveIndex(prev => (prev + 1) % cards.length);
    } else if (dragOffset > threshold) {
      setActiveIndex(prev => (prev - 1 + cards.length) % cards.length);
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const diff = e.touches[0].clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 50;
    
    if (dragOffset < -threshold) {
      setActiveIndex(prev => (prev + 1) % cards.length);
    } else if (dragOffset > threshold) {
      setActiveIndex(prev => (prev - 1 + cards.length) % cards.length);
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <>
      <SmoothCursor />
      
      <div 
        ref={containerRef}
        className="w-full h-screen bg-[#fcfdf6] flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full max-w-7xl px-4 md:px-8">
          <div className="relative w-full h-full flex items-center justify-center">
            {cards.map((card, index) => (
              <Card
                key={index}
                {...card}
                index={index}
                totalCards={cards.length}
                activeIndex={activeIndex}
                dragOffset={dragOffset}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}