import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Cho phép tất cả hostnames với HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // Cho phép tất cả hostnames với HTTP
      },
    ],
  },
};

export default nextConfig;
