"use client";
import { useEffect, useRef, useState } from "react";
export function useScrollSpy(ids: string[]) {
  const [current, setCurrent] = useState("");
  const initialized = useRef(false);
  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;
    let disposed = false;
    const initialHash = window.location.hash.slice(1);
    const headerOffset = () => {
      const bar = document.querySelector(".category-bar");
      return bar ? bar.getBoundingClientRect().bottom + 48 : 180;
    };
    const update = () => {
      if (!initialized.current) return;
      const offset = headerOffset();
      const passed = nodes.filter(
        (node) => node.getBoundingClientRect().top <= offset,
      );
      const next =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8
          ? nodes.at(-1)!
          : passed.at(-1) || nodes[0];
      setCurrent(next.id);
      if (window.scrollY > 150 && window.location.hash !== `#${next.id}`)
        history.replaceState(null, "", `#${next.id}`);
    };
    const frame = requestAnimationFrame(() => {
      if (!initialized.current) {
        // Font metrics can change card row heights after the first paint.
        void document.fonts.ready.then(() => {
          if (disposed) return;
          initialized.current = true;
          if (initialHash && ids.includes(initialHash))
            document
              .getElementById(initialHash)
              ?.scrollIntoView({ behavior: "instant", block: "start" });
          update();
        });
        return;
      }
      update();
    });
    let scrollFrame = 0;
    const onScroll = () => {
      if (!scrollFrame)
        scrollFrame = requestAnimationFrame(() => {
          scrollFrame = 0;
          update();
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(update, {
      rootMargin: "-145px 0px -45% 0px",
      threshold: [0, 0.1, 0.5, 1],
    });
    nodes.forEach((node) => observer.observe(node));
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [ids]);
  return ids.includes(current) ? current : ids[0] || "";
}
