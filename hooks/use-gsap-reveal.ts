"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
  once?: boolean;
  stagger?: number;
};

export function useGsapReveal<T extends HTMLElement>(options?: RevealOptions) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const target = ref.current;
    if (!target) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(target, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        { opacity: 0, y: options?.y ?? 28 },
        {
          opacity: 1,
          y: 0,
          duration: options?.duration ?? 0.7,
          delay: options?.delay ?? 0,
          ease: "power2.out",
          stagger: options?.stagger,
          scrollTrigger: {
            trigger: target,
            start: options?.start ?? "top 85%",
            once: options?.once ?? true,
          },
        },
      );
    }, target);

    return () => {
      ctx.revert();
    };
  }, [options?.delay, options?.duration, options?.once, options?.start, options?.stagger, options?.y]);

  return ref;
}
