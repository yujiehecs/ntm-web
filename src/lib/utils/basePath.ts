/**
 * Get the base path for the application
 * This should match the basePath set in next.config.ts
 * 
 * For static exports with basePath:
 * - Fetches to public files need basePath prefix
 * - Navigation via window.location.href needs basePath prefix
 * - Next.js <Link> components handle basePath automatically
 */
export function getBasePath(): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return '';
  }

  // For GitHub Pages deployment, the basePath is /ntm-web
  // For Cloudflare or local dev, there's no basePath
  // Detect by checking the hostname
  const hostname = window.location.hostname;
  
  // GitHub Pages uses github.io domain
  if (hostname.includes('github.io')) {
    return '/ntm-web';
  }
  
  // For all other cases (Cloudflare, local dev), no basePath
  return '';
}
