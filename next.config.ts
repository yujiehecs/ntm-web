import type { NextConfig } from "next";

// Only use basePath when explicitly building for GitHub Pages
// Default to no basePath (works for local dev and Cloudflare Pages)
const useBasePath = process.env.USE_BASE_PATH === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: useBasePath ? '/ntm-web' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
