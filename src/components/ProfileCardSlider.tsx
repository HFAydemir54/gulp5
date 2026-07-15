type ProfileCardSliderProps = {
  images: string[];
  alt: string;
};

export default function ProfileCardSlider({ images, alt }: ProfileCardSliderProps) {
  if (images.length <= 1) {
    return (
      <div className="h-24 flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-800">
        <img
          src={images[0]}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const loopImages = [...images, ...images];
  const duration = images.length * 3;

  return (
    <div className="h-24 flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-800">
      <div
        className="flex h-full w-max animate-[card-marquee_linear_infinite]"
        style={{ animationDuration: `${duration}s` }}
      >
        {loopImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={alt}
            loading="lazy"
            className="h-24 w-24 shrink-0 object-cover"
          />
        ))}
      </div>
    </div>
  );
}
