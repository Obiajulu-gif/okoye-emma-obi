"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  x?: number;
  y?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  trigger?: Element | string | null;
  start?: string | number;
  end?: string | number;
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
      gsap.set(target, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const trigger = options?.trigger || target;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        { opacity: 0, x: options?.x ?? 0, y: options?.y ?? 28 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: options?.duration ?? 0.7,
          delay: options?.delay ?? 0,
          ease: options?.ease ?? "power2.out",
          stagger: options?.stagger,
          scrollTrigger: {
            trigger,
            start: options?.start ?? "top 85%",
            end: options?.end,
            once: options?.once ?? true,
          },
        },
      );
    }, target);

    return () => {
      ctx.revert();
    };
  }, [
    options?.delay,
    options?.duration,
    options?.ease,
    options?.end,
    options?.once,
    options?.start,
    options?.stagger,
    options?.trigger,
    options?.x,
    options?.y,
  ]);

  return ref;
}
