"use client";
import Image from "next/image";
import { imageBlur } from "@/lib/config";
export default function Photo({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <span className={`photo ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={imageBlur}
        onLoad={(event) => {
          event.currentTarget.style.removeProperty("opacity");
        }}
        onError={(event) => {
          event.currentTarget.style.opacity = "0";
        }}
      />
    </span>
  );
}
