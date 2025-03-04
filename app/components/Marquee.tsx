"use client"

import { useEffect, useRef, useState } from "react"
import Illustrations from "./Illustrations"
type MarqueeAnimationType = (
  element: HTMLElement,
  scrollWidth: number
) => void

const marqueeAnimation: MarqueeAnimationType = (element, scrollWidth) => {
  // Animate from translateX(0) to translateX(-scrollWidth) so the first copy scrolls completely off
  element.animate(
    [
      { transform: "translateX(0)" },
      { transform: `translateX(-${scrollWidth}px)` },
    ],
    {
      duration: 20000,
      easing: "linear",
      iterations: Infinity,
    }
  )
}

type SkillsProps = {
  skills: { name: string; logo: string }[]
}

const Marquee: React.FC<SkillsProps> = ({ skills }) => {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [scrollWidth, setScrollWidth] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => {
      if (marqueeRef.current) {
        // Measure the width of the first copy only (assumes both copies are identical)
        const firstCopy = marqueeRef.current.firstElementChild as HTMLElement
        if (firstCopy) {
          setScrollWidth(firstCopy.getBoundingClientRect().width)
        }
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial measurement

    return () => window.removeEventListener("resize", handleResize)
  }, [skills])

  useEffect(() => {
    if (marqueeRef.current && scrollWidth) {
      // Cancel previous animations if any.
      marqueeRef.current.getAnimations().forEach((anim) => anim.cancel())
      marqueeAnimation(marqueeRef.current, scrollWidth)
    }
  }, [scrollWidth, skills])

  return (
    <div className="relative overflow-x-hidden bg-gradient-to-tr from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors">
      <Illustrations />
      <div className="flex whitespace-nowrap p-5 lg:p-7" ref={marqueeRef}>
        {/* First copy */}
        <div className="flex gap-20 lg:gap-24">
          {skills.map(({ name, logo }, index) => (
            <span
              key={`first-${index}`}
              className="flex items-center text-lg text-black lg:text-base dark:text-[#d5dee7]"
            >
              <img
                src={logo}
                alt={name}
                className="mx-2 w-11 h-11 lg:w-14 lg:h-14 object-contain"
              />
              {name}
            </span>
          ))}
        </div>
        {/* Duplicate copy for seamless looping */}
        <div className="flex gap-8 ml-20 lg:gap-24">
          {skills.map(({ name, logo }, index) => (
            <span
              key={`second-${index}`}
              className="flex items-center text-lg text-black lg:text-base dark:text-[#d5dee7]"
            >
              <img
                src={logo}
                alt={name}
                className="mx-2 w-11 h-11 lg:w-14 lg:h-14 object-contain"
              />
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Marquee