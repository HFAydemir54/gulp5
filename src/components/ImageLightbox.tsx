"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: ImageLightboxProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const scrollToImage = (index: number, behavior: ScrollBehavior = "smooth") => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    sliderRef.current.scrollTo({ left: width * index, behavior });
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    if (width === 0) return;
    setActiveIndex(Math.round(sliderRef.current.scrollLeft / width));
  };

  const nextImage = () => {
    scrollToImage(activeIndex < images.length - 1 ? activeIndex + 1 : 0);
  };

  const prevImage = () => {
    scrollToImage(activeIndex > 0 ? activeIndex - 1 : images.length - 1);
  };

  useEffect(() => {
    scrollToImage(initialIndex, "auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
        aria-label="Kapat"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div
        ref={sliderRef}
        onScroll={handleScroll}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((url, index) => (
          <div
            key={index}
            className="relative h-full w-full shrink-0 snap-center select-none"
          >
            <Image
              src={url}
              alt={`Görsel ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority={index === initialIndex}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
            aria-label="Önceki resim"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
            aria-label="Sonraki resim"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/40 px-2.5 py-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToImage(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-4 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Resme git ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
