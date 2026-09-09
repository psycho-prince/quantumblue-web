import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/features', destination: '/#platform', permanent: true },
      { source: '/specs', destination: '/#crypto-tests', permanent: true },
      { source: '/login', destination: '/sign-in', permanent: true },
      { source: '/signin', destination: '/sign-in', permanent: true },
      { source: '/api/docs', destination: '/docs', permanent: true },
    ]
  },
};

export default nextConfig;
