import type { NextConfig } from "next";

// Use basePath for GitHub Pages, but not for Cloudflare Pages
// Explicitly check for CLOUDFLARE_PAGES to ensure no basePath on Cloudflare
const isCloudflare = process.env.CF_PAGES === '1' || process.env.CLOUDFLARE_PAGES === '1';
const isGitHubPages = process.env.GITHUB_PAGES === 'true' && !isCloudflare;

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGitHubPages ? '/ntm-web' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
