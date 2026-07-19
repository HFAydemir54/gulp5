import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "obnimi.shop",
      },
      {
        protocol: "https",
        hostname: "www.elazig3.xyz",
      },
    ],
  },
};

export default nextConfig;
