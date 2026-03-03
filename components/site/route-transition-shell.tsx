"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function RouteTransitionShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const initialRenderRef = useRef(true);

  useLayoutEffect(() => {
    if (reduceMotion) return;

    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      gsap.set(overlay, { autoAlpha: 0, scaleY: 0, transformOrigin: "top" });
      gsap.set(content, { opacity: 1, y: 0 });
      return;
    }

    const timeline = gsap.timeline();
    timeline
      .set(overlay, { transformOrigin: "top", autoAlpha: 0.7, scaleY: 0 })
      .to(overlay, { scaleY: 1, duration: 0.22, ease: "power2.out" })
      .fromTo(content, { opacity: 0.9, y: 12 }, { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }, "<")
      .set(overlay, { transformOrigin: "bottom" })
      .to(overlay, { scaleY: 0, autoAlpha: 0, duration: 0.26, ease: "power2.inOut" });

    return () => {
      timeline.kill();
    };
  }, [pathname, reduceMotion]);

  return (
    <>
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[95] origin-top bg-gradient-to-b from-[#061325]/85 via-[#0d223a]/75 to-[#061325]/85"
        aria-hidden
      />
      <div ref={contentRef}>{children}</div>
    </>
  );
}
