'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
export const HOW_STEPS = [
    {
        id: 1,
        title: "Collect Data",
        desc: "Gather all necessary data from your operations, including energy usage, transportation, and other relevant activities.",
        image: "/Standards/VCS.png",
    },
    {
        id: 2,
        title: "Analyze Emissions",
        desc: "Use our platform to analyze your carbon emissions and identify key areas for improvement.",
        image: "/Standards/VCS.png",
    },
    {
        id: 3,
        title: "Generate Reports",
        desc: "Generate audit-ready reports to showcase your sustainability efforts and compliance.",
        image: "/Standards/VCS.png",
    },
];
import Image from 'next/image';

export const HowSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-slate-50">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center h-full py-12">
          
          {/* Left: Steps Content */}
          <div className="flex flex-col justify-center space-y-12">
            <div>
               <h2 className="text-4xl font-bold text-slate-900 mb-6">How CarbonFlow Works</h2>
               <p className="text-lg text-slate-500">From data to audit-ready reports in three simple steps.</p>
            </div>

            <div className="space-y-8 relative">
               {/* Progress Line */}
               <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
               <motion.div 
                 className="absolute left-6 top-0 w-0.5 bg-brand-600 origin-top"
                 style={{ height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
               />

              {HOW_STEPS.map((step, index) => {
                // Logic to calculate opacity based on scroll position
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const opacity = useTransform(
                  scrollYProgress,
                  [index * 0.3, (index * 0.3) + 0.15, (index * 0.3) + 0.3],
                  [0.3, 1, 0.3]
                );
                
                return (
                  <motion.div 
                    key={step.id}
                    style={{ opacity: index === 2 ? useTransform(scrollYProgress, [0.6, 0.9], [0.3, 1]) : opacity }}
                    className="relative pl-16 py-4"
                  >
                    <span className="absolute left-0 top-6 w-12 h-12 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-lg font-bold text-slate-400 z-10 shadow-sm">
                      {step.id}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Visuals */}
          <div className="h-[50vh] lg:h-[600px] w-full relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
             {HOW_STEPS.map((step, index) => (
               <motion.div
                 key={step.id}
                 className="absolute inset-0"
                 style={{
                    opacity: useTransform(
                      scrollYProgress,
                      [index * 0.3, (index * 0.3) + 0.05, (index * 0.3) + 0.3, (index * 0.3) + 0.35],
                      [0, 1, 1, 0]
                    ),
                    zIndex: 10 - index // Ensure proper stacking if opacity overlaps
                 }}
               >
                 <Image 
                    src={step.image} 
                    alt={step.title} 
                    fill 
                    className="object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent flex items-end p-8">
                    <span className="text-white font-mono text-sm uppercase tracking-widest">Step 0{step.id} Visualization</span>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};