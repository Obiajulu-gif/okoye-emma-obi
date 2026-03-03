"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };

    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return reduceMotion;
}
