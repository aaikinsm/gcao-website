import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gcaocanada.org",
      },
    ],
  },
};

export default nextConfig;
