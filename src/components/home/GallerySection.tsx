"use client";
import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { gallery } from "@/data/site";
import Photo from "@/components/ui/Photo";
import { InstagramIcon } from "@/components/ui/icons";
const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });
export default function GallerySection() {
  const [selected, setSelected] = useState<number | null>(null);
  const close = useCallback(() => setSelected(null), []);
  return (
    <section
      className="gallery-section"
      id="gallery"
      aria-labelledby="gallery-title"
    >
      <h2 className="sr-only" id="gallery-title">
        Галерея
      </h2>
      <div className="gallery-track">
        {gallery.map((photo, index) => (
          <button
            className="gallery-photo"
            key={photo.src}
            onClick={() => setSelected(index)}
            aria-label={`Открыть фото ${index + 1}: ${photo.alt}`}
          >
            <Photo {...photo} sizes="(max-width: 767px) 45vw, 20vw" />
            <span className="gallery-hover">
              <InstagramIcon />
            </span>
          </button>
        ))}
      </div>
      {selected !== null && (
        <Lightbox initialIndex={selected} photos={gallery} onClose={close} />
      )}
    </section>
  );
}
