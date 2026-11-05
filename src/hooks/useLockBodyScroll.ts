"use client";
import { useEffect } from "react";
let locks = 0;
let previousOverflow = "";
let previousPadding = "";
export function useLockBodyScroll() {
  useEffect(() => {
    if (locks++ === 0) {
      previousOverflow = document.body.style.overflow;
      previousPadding = document.body.style.paddingRight;
      const width = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (width) document.body.style.paddingRight = `${width}px`;
    }
    return () => {
      if (--locks === 0) {
        document.body.style.overflow = previousOverflow;
        document.body.style.paddingRight = previousPadding;
      }
    };
  }, []);
}
