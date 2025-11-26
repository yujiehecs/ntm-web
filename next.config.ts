import type { NextConfig } from "next";

// Use basePath for GitHub Pages, but not for Cloudflare Pages
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGitHubPages ? '/ntm-web' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
