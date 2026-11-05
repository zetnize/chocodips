"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
export default function ParallaxLayer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (reduced) {
      element.style.removeProperty("transform");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const offset = Math.max(
        -20,
        Math.min(
          20,
          ((rect.top + rect.height / 2) / window.innerHeight - 0.5) * 40,
        ),
      );
      element.style.transform = `translate3d(0,${offset}px,0)`;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);
  return (
    <div ref={ref} className="parallax-layer">
      {children}
    </div>
  );
}
