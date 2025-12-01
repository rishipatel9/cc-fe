"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const blogs = [
  {
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
    date: "Sep. 19, 2025",
    category: "Press Releases",
    readTime: "3 Min Read",
    title: "Maxar Partners with AIDC to Accelerate the Resilience of Taiwan's UAV Industry Against GPS Interference",
  },
  {
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    date: "Jun. 4, 2025",
    category: "Defense & Intelligence",
    readTime: "4 Min Read",
    title: "Five Facts About Vantor's Raptor Software Suite for GPS-Denied Drone Operations",
  },
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    date: "Jun. 4, 2025",
    category: "Defense & Intelligence",
    readTime: "3 Min Read",
    title: "Maxar and Saab Agree Strategic Partnership to Develop Multi-Domain Battlespace Solutions and Advance Europe's Space-Based Capabilities",
  },
];

const Blogs = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    updateScreenWidth(); // Set initial width
    window.addEventListener("resize", updateScreenWidth);

    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  const getFlexBasis = (index: number) => {
    if (hoveredIndex === null) {
      return "33.333%"; // Equal width when no hover
    }
    if (index === hoveredIndex) {
      return "40%"; // Hovered card takes 40%
    }
    return "30%"; // Other two cards share 60% (30% each)
  };

  return (
    <div className="bg-[#fcfdf6] w-full py-20">
      <div className="w-full border-t border-dashed border-[#6c5f31]/30 mb-8"></div>

      <div className="w-full ">
        <div className="mx-auto max-w-7xl mb-12">
          <p className="text-[#6c5f31]/70 text-sm uppercase tracking-wider">Related Articles & News</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#080c04]">
            Blogs
          </h2>
        </div>

        <div className="rounded-2xl w-full">
          <div className="flex flex-col md:flex-row w-full">
            {blogs.map((blog, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 transition-all duration-700 ease-out cursor-pointer group"
                style={{
                  flexBasis: isClient && screenWidth >= 768 ? getFlexBasis(index) : "auto", // ✅ Use client-side width
                  flexShrink: 0,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="overflow-hidden relative">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={800}
                    height={600}
                    className={`w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${
                      hoveredIndex === index
                        ? "h-82 sm:h-90 md:h-102 lg:h-110" // Height increased by ~10px for each breakpoint
                        : "h-62 sm:h-70 md:h-82 lg:h-90"
                    }`}
                  />
                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="flex flex-col gap-2 px-2 sm:px-4">
                  <div className="text-xs text-[#6c5f31]/80 flex flex-wrap items-center gap-2">
                    <span>{blog.date}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-xs">{blog.category}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-xs">{blog.readTime}</span>
                  </div>

                  <h3
                    className={`font-medium text-[#080c04] leading-tight transition-all duration-700 ${
                      hoveredIndex === index ? "text-lg sm:text-xl lg:text-2xl" : "text-base sm:text-lg"
                    }`}
                  >
                    {blog.title}
                  </h3>

                  {/* Expanding description on hover */}
                  <div
                    className={`overflow-hidden transition-all duration-700 ease-out ${
                      hoveredIndex === index ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-sm text-[#6c5f31]/70 leading-relaxed">Read more about this article...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;