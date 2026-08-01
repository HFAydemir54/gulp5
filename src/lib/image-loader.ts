"use client";

// Cloudinary'de duran görseller için dönüşüm parametrelerini URL'e ekler:
// f_auto tarayıcıya göre AVIF/WebP seçer, q_auto kaliteyi otomatik ayarlar,
// w_<genislik> gerçek gösterim boyutuna indirir. Böylece görselleri Vercel'in
// optimizasyon kotasını harcamadan optimize etmiş oluyoruz.
//
// Cloudinary dışındaki kaynaklar (henüz taşınmamış profil görselleri ve yerel
// statik dosyalar) olduğu gibi bırakılır.
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const marker = "/image/upload/";
  const index = src.indexOf(marker);

  if (!src.includes("res.cloudinary.com") || index === -1) {
    return src;
  }

  const transforms = [
    "f_auto",
    quality ? `q_${quality}` : "q_auto",
    `w_${width}`,
    "c_limit",
  ].join(",");

  const head = src.slice(0, index + marker.length);
  const tail = src.slice(index + marker.length);
  return `${head}${transforms}/${tail}`;
}
