"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import WaveLoader from "@/components/ui/WaveLoader";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

function IntroScrollLock() {
  useLockBodyScroll();
  useEffect(() => {
    const keepAtTop = () => {
      if (window.scrollY !== 0)
        window.scrollTo({ top: 0, behavior: "instant" });
    };
    const preventScroll = (event: Event) => event.preventDefault();
    const preventScrollKeys = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest(
          "input, textarea, select, button, [contenteditable=true]",
        )
      )
        return;
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      )
        event.preventDefault();
    };
    keepAtTop();
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("scroll", keepAtTop, { passive: true });
    window.addEventListener("keydown", preventScrollKeys);
    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("scroll", keepAtTop);
      window.removeEventListener("keydown", preventScrollKeys);
    };
  }, []);
  return null;
}

export default function IntroHero({
  menuAction,
  gallery,
}: {
  menuAction: ReactNode;
  gallery: ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [finished, setFinished] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false);
  const [visit, setVisit] = useState<"checking" | "new" | "returning">(
    "checking",
  );

  useEffect(() => {
    const key = "choco-dips:visited:v1";
    let returning = false;
    try {
      returning = localStorage.getItem(key) === "1";
    } catch {
      /* Storage may be unavailable in private browser settings. */
    }
    const frame = requestAnimationFrame(() => {
      if (returning) {
        setFinished(true);
        setTransitionComplete(true);
        setVisit("returning");
      } else {
        try {
          localStorage.setItem(key, "1");
        } catch {
          /* The first-visit experience still works without storage. */
        }
        setVisit("new");
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!finished || visit === "returning") return;
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 1400;
    const timer = setTimeout(() => setTransitionComplete(true), delay);
    return () => clearTimeout(timer);
  }, [finished, visit]);

  useEffect(() => {
    if (visit !== "new") return;
    const video = videoRef.current;
    if (!video) return;
    video.defaultPlaybackRate = 1.4;
    video.playbackRate = 1.4;
    let disposed = false;
    let frame = 0;
    if (video.error) {
      frame = requestAnimationFrame(() => {
        setFailed(true);
        setFinished(true);
      });
    } else {
      video.play().catch(() => {
        if (disposed) return;
        if (video.error) {
          setFailed(true);
          setFinished(true);
        } else setBlocked(true);
      });
    }
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      video.pause();
    };
  }, [visit]);

  function play() {
    videoRef.current
      ?.play()
      .then(() => setBlocked(false))
      .catch(() => setBlocked(true));
  }

  return (
    <section
      className={`intro-hero intro-${visit} ${finished ? "intro-finished" : "intro-playing"}`}
      aria-labelledby="intro-hero-title"
    >
      {!transitionComplete && visit === "new" && <IntroScrollLock />}
      <h1 className="sr-only" id="intro-hero-title">
        Choco Dips — кофе и десерты в Нальчике
      </h1>
      <div className="container intro-stage">
        <div className="intro-video-panel">
          <div className="intro-video-frame">
            {failed || visit !== "new" ? (
              <div className="intro-video-fallback">
                <span className="logo-art">
                  <Image
                    src="/brand/choco-dips-logo.png"
                    alt="Choco Dips"
                    width={1254}
                    height={1254}
                    sizes="300px"
                  />
                </span>
              </div>
            ) : (
              <video
                ref={videoRef}
                src="/videos/choco-dips-intro.mp4"
                width={672}
                height={448}
                muted
                playsInline
                preload="auto"
                aria-label="Шоколадная заставка Choco Dips"
                onEnded={() => setFinished(true)}
                onPlay={() => {
                  setBlocked(false);
                }}
                onError={() => {
                  setFailed(true);
                  setFinished(true);
                }}
              />
            )}
            {blocked && !finished && !failed && (
              <button
                className="intro-play-button pill solid-ink"
                onClick={play}
              >
                Воспроизвести заставку
              </button>
            )}
          </div>
          {!finished && visit === "new" && (
            <div className="intro-loading">
              <WaveLoader />
            </div>
          )}
          <div
            className="intro-menu-action"
            inert={!finished}
            aria-hidden={!finished}
          >
            {menuAction}
          </div>
        </div>
        <div
          className="intro-gallery-panel"
          inert={!finished}
          aria-hidden={!finished}
        >
          {gallery}
        </div>
      </div>
      <noscript>
        <p className="container">
          Посмотрите наше <a href="/menu">меню</a> — завтраки, кофе и десерты.
        </p>
      </noscript>
    </section>
  );
}
