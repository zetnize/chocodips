"use client";
import { useSyncExternalStore } from "react";
function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
export function useScrolled() {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > 40,
    () => false,
  );
}
