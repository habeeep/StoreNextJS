import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async rewrites() {
    return [
      {
        source: '/backend/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL_AUTH}/:path*`,
      },
      {
        source: '/backend/feed/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL_FEED}/:path*`,
      },
    ];
  },
};

export default nextConfig;