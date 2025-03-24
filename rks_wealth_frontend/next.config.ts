import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export", // Enables static export
  reactStrictMode: true,
  trailingSlash: true, // Ensures proper file paths for static hosting
  images: {
    unoptimized: true, // Needed since Next.js can't optimize images in static mode
  },
  async rewrites() {
    return isDev
      ? [
          {
            source: "/api/:path*",
            destination: "http://localhost:5000/api/:path*",
          },
        ]
      : [];
  },
};

export default nextConfig;
