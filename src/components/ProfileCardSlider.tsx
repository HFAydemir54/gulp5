"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type ProfileCardSliderProps = {
  images: string[];
  alt: string;
};

export default function ProfileCardSlider({
  images,
  alt,
}: ProfileCardSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (images.length <= 1) {
    return (
      <div className="relative h-[124px] flex-1 overflow-hidden bg-[var(--site-slider-bg)]">
        <Image
          src={images[0]}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  const loopImages = [...images, ...images];
  const duration = images.length * 3;

  return (
    <div
      ref={containerRef}
      className="h-[124px] flex-1 overflow-hidden bg-[var(--site-slider-bg)]"
    >
      <div
        className="flex h-full w-max animate-[card-marquee_linear_infinite]"
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: isVisible ? "running" : "paused",
        }}
      >
        {loopImages.map((src, i) => (
          <div key={i} className="relative h-[124px] w-[124px] shrink-0">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
