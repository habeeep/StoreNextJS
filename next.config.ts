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
        source: '/backend/news/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL_NEWS}/:path*`,
      },
    ];
  },
};

export default nextConfig;