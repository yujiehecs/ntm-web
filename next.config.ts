import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ntm-web',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
