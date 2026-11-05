"use client";
import { useEffect, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import Photo from "@/components/ui/Photo";
import { ChevronIcon } from "@/components/ui/icons";
import type { GalleryPhoto } from "@/lib/types";
export default function Lightbox({
  initialIndex,
  photos,
  onClose,
}: {
  initialIndex: number;
  photos: GalleryPhoto[];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex(
          (value) =>
            (value + (event.key === "ArrowRight" ? 1 : -1) + photos.length) %
            photos.length,
        );
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [photos.length]);
  const move = (direction: number) =>
    setIndex((value) => (value + direction + photos.length) % photos.length);
  return (
    <Modal
      onClose={onClose}
      labelledBy="lightbox-title"
      className="lightbox-backdrop"
    >
      <h2 id="lightbox-title" className="sr-only">
        Галерея Choco Dips
      </h2>
      <div
        className="lightbox-photo"
        onPointerDown={(event) => {
          pointer.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = pointer.current;
          if (
            start &&
            Math.abs(event.clientX - start.x) > 45 &&
            Math.abs(event.clientX - start.x) >
              Math.abs(event.clientY - start.y)
          )
            move(event.clientX < start.x ? 1 : -1);
          pointer.current = null;
        }}
        onPointerCancel={() => {
          pointer.current = null;
        }}
      >
        <Photo {...photos[index]} sizes="(max-width: 767px) 95vw, 85vw" />
      </div>
      <div className="lightbox-controls">
        <button
          className="icon-button previous"
          onClick={() => move(-1)}
          aria-label="Предыдущее фото"
        >
          <ChevronIcon />
        </button>
        <p aria-live="polite">
          {index + 1} / {photos.length}
          <span>{photos[index].alt}</span>
        </p>
        <button
          className="icon-button"
          onClick={() => move(1)}
          aria-label="Следующее фото"
        >
          <ChevronIcon />
        </button>
      </div>
    </Modal>
  );
}
