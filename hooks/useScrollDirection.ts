"use client";

import { useEffect, useState, useRef } from "react";

export type ScrollDirection = "up" | "down" | "none";

export function useScrollDirection(threshold = 10) {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("none");
  const [isAtTop, setIsAtTop] = useState(true);
  const prevScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    prevScrollY.current = window.scrollY;
    const initialAtTop = window.scrollY < 20;
    setTimeout(() => {
      setIsAtTop(initialAtTop);
    }, 0);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsAtTop(scrollY < 20);

      if (scrollY < 0) return;

      const difference = scrollY - prevScrollY.current;

      if (Math.abs(difference) > threshold) {
        if (difference > 0) {
          setScrollDirection("down");
        } else {
          setScrollDirection("up");
        }
        prevScrollY.current = scrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { scrollDirection, isAtTop };
}
