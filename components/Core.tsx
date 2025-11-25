"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Core = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const imagesRef = useRef<(HTMLDivElement | null)[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  const achievements = [
    {
      image: "/core/C1.jpg",
      title: "Security",
      description: "Enterprise-grade security for carbon credit transactions",
    },
    {
      image: "/core/C2.jpg",
      title: "Reliability",
      description: "Trusted by leading organizations worldwide",
    },
    {
      image: "/core/C3.jpg",
      title: "Simplicity",
      description: "Streamlined carbon offsetting process",
    },
  ]

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean)
    const images = imagesRef.current.filter(Boolean)

    if (cards.length === 0) return

    const timer = setTimeout(() => {
      // Initial state - cards start from below
      gsap.set(cards, {
        opacity: 0,
        yPercent: 50,
      })

      gsap.set(images, {
        scale: 1.4,
      })

      // Animate each card individually with scroll
      cards.forEach((card, index) => {
        gsap.to(card, {
          opacity: 1,
          yPercent: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            scroller: "[data-scroll-container]",
            start: "top 95%",
            end: "top 30%",
            scrub: 0.5, // Lower scrub = faster animation
            toggleActions: "play none none reverse",
          },
        })

        // Image parallax zoom
        gsap.to(images[index], {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            scroller: "[data-scroll-container]",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        })
      })

      ScrollTrigger.refresh()
    }, 100)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section 
      ref={sectionRef} 
      className="relative pt-20 pb-20 bg-secondary border-r border-l border-dashed border-white/10 shadow" 
      data-scroll
      data-scroll-speed="3"
    >
      <div className="w-full border-t border-dashed border-white/10 mb-8"></div>

      <div className="mx-auto max-w-7xl px-6">
        <p className="text-white/40 text-sm uppercase tracking-wider text-right mb-4">Core Values</p>
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white text-right mb-16">
          Delivering Results
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 mb-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              className="relative h-screen md:h-[600px] overflow-hidden group cursor-pointer"
              data-scroll
              data-scroll-speed="5"
            >
              {/* Image Container */}
              <div
                ref={(el) => {
                  imagesRef.current[index] = el
                }}
                className="absolute inset-0 overflow-hidden"
              >
                <Image
                  src={achievement.image}
                  alt={achievement.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                {/* Description - Shows on hover */}
                <p className="text-sm md:text-base text-white/90 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                  {achievement.description}
                </p>

                {/* Title - Always visible */}
                <h3 className="text-3xl md:text-4xl font-bold transform group-hover:translate-y-0 transition-all duration-500 ease-out">
                  {achievement.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-dashed border-white/10 mt-8"></div>
    </section>
  )
}

export default Core