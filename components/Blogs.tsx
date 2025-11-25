"use client"
import React, { useState } from 'react'

const blogs = [
  {
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
    date: 'Sep. 19, 2025',
    category: 'Press Releases',
    readTime: '3 Min Read',
    title: "Maxar Partners with AIDC to Accelerate the Resilience of Taiwan's UAV Industry Against GPS Interference",
    span: 'col-span-1',
  },
  {
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    date: 'Jun. 4, 2025',
    category: 'Defense & Intelligence',
    readTime: '4 Min Read',
    title: "Five Facts About Vantor's Raptor Software Suite for GPS-Denied Drone Operations",
    span: 'md:col-span-2 col-span-1',
  },
  {
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
    date: 'Jun. 4, 2025',
    category: 'Defense & Intelligence',
    readTime: '3 Min Read',
    title: 'Maxar and Saab Agree Strategic Partnership to Develop Multi-Domain Battlespace Solutions and Advance Europe\'s Space-Based Capabilities',
    span: 'col-span-1',
  },
];

const Blogs = () => {
  const [hoverHistory, setHoverHistory] = useState<number[]>([]);

  const handleMouseEnter = (index) => {
    setHoverHistory(prev => {
      const filtered = prev.filter(i => i !== index);
      return [...filtered, index];
    });
  };

  const getScale = (index: number) => {
    if (hoverHistory.length === 0) return 'scale-100';

    const lastHovered = hoverHistory[hoverHistory.length - 1];
    const previousHovered = hoverHistory[hoverHistory.length - 2];

    if (index === lastHovered) {
      return 'scale-110';
    }
    if (index === previousHovered) {
      return 'scale-105';
    }
    return 'scale-100';
  };

  const getZIndex = (index: number) => {
    if (hoverHistory.length === 0) return 'z-10';

    const lastHovered = hoverHistory[hoverHistory.length - 1];
    const previousHovered = hoverHistory[hoverHistory.length - 2];

    if (index === lastHovered) {
      return 'z-30';
    }
    if (index === previousHovered) {
      return 'z-20';
    }
    return 'z-10';
  };
  
  return (
    <div className='bg-accent w-full py-20'>
      <div className="w-full border-t border-dashed border-gray-300 mb-8"></div>

      <div className="mx-auto max-w-7xl px-6">
        <p className='text-gray-600 text-sm uppercase tracking-wider '>Related Articles & News</p>
        <h2 className='text-6xl md:text-7xl font-semibold tracking-tight text-gray-900 mb-12'>
          Blogs
        </h2>
        <div className='bg-gray-100 p-6'>
          <div className='grid md:grid-cols-4 gap-0'>
            {blogs.map((blog, index) => (
              <div 
                key={index} 
                className={`flex flex-col gap-4 ${index === 1 ? 'md:col-span-2' : 'col-span-1'} ${getZIndex(index)} relative hover:scale-105 transition-all duration-500 ease-out cursor-pointer`}
                onMouseEnter={() => handleMouseEnter(index)}
              >
                <div className="overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className={`w-full h-auto object-cover aspect-video transition-transform duration-500 ease-out ${getScale(index)}`}
                  />
                </div>
                <div className='flex flex-col gap-2 px-6'>
                  <div className='text-xs text-gray-600 flex items-center gap-2'>
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.category}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className='text-lg font-medium text-gray-900 leading-tight'>{blog.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blogs