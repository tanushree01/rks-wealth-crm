import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static export
  reactStrictMode: true,
  trailingSlash: true, // Ensures proper file paths for static hosting
  images: {
    unoptimized: true, // Needed since Next.js can't optimize images in static mode
  },
};

export default nextConfig;
