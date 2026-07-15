"use client";

import { useRef, useState, useEffect } from "react";

interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Update active dot index based on scroll position
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    if (width === 0) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  const scrollToImage = (index: number) => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    sliderRef.current.scrollTo({
      left: width * index,
      behavior: "smooth",
    });
  };

  const nextImage = () => {
    if (activeIndex < images.length - 1) {
      scrollToImage(activeIndex + 1);
    } else {
      scrollToImage(0); // Loop back
    }
  };

  const prevImage = () => {
    if (activeIndex > 0) {
      scrollToImage(activeIndex - 1);
    } else {
      scrollToImage(images.length - 1); // Loop to end
    }
  };

  // Keep track of resize to adjust scroll positioning if activeIndex changed
  useEffect(() => {
    const handleResize = () => {
      if (!sliderRef.current) return;
      const width = sliderRef.current.clientWidth;
      sliderRef.current.scrollLeft = width * activeIndex;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex]);

  if (!images || images.length === 0) return null;

  return (
    <div className="group relative w-full overflow-hidden bg-zinc-50 dark:bg-purple-800/40 aspect-video md:aspect-[21/9]">
      {/* Slider Container */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((url, index) => (
          <div
            key={index}
            className="h-full w-full shrink-0 snap-center select-none"
          >
            <img
              src={url}
              alt={`Slider Image ${index + 1}`}
              className="h-full w-full object-cover pointer-events-none"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Only shown if more than 1 image) */}
      {images.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100 hover:bg-black/55 active:scale-95 focus:outline-none"
            aria-label="Önceki resim"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100 hover:bg-black/55 active:scale-95 focus:outline-none"
            aria-label="Sonraki resim"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/25 px-2.5 py-1.5 backdrop-blur-sm">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToImage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-4 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/70"
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
