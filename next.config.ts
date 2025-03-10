import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [],
    remotePatterns: [],
    unoptimized: true, // This will disable the image optimization for all images
  },
};

export default nextConfig;
