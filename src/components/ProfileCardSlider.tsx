import Image from "next/image";

type ProfileCardSliderProps = {
  images: string[];
  alt: string;
};

export default function ProfileCardSlider({ images, alt }: ProfileCardSliderProps) {
  if (images.length <= 1) {
    return (
      <div className="relative h-24 flex-1 overflow-hidden bg-purple-800/40">
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
    <div className="h-24 flex-1 overflow-hidden bg-purple-800/40">
      <div
        className="flex h-full w-max animate-[card-marquee_linear_infinite]"
        style={{ animationDuration: `${duration}s` }}
      >
        {loopImages.map((src, i) => (
          <div key={i} className="relative h-24 w-24 shrink-0">
            <Image src={src} alt={alt} fill sizes="96px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
