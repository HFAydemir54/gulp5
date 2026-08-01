import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Optimizasyonu Cloudinary yapıyor (bkz. src/lib/image-loader.ts), bu yüzden
    // Vercel'in görsel optimizasyon kotası hiç kullanılmıyor.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Varsayılan genişlik listesi 8 cihaz + 8 görsel boyutu üretiyor ve her
    // <img> için 11 girdilik srcset basılıyordu. Sitedeki en büyük görsel
    // alanı profil sayfasındaki ~672px'lik sütun; bu listeler o boyuta göre
    // daraltıldı (retina için iki katı dahil).
    deviceSizes: [640, 828, 1080],
    imageSizes: [96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Pendik profilleri henüz taşınmadı, kaynak sunucudan servis ediliyor.
      {
        protocol: "https",
        hostname: "obnimi.shop",
      },
    ],
  },
};

export default nextConfig;
