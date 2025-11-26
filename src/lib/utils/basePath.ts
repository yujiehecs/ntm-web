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
  // We can detect this by checking the current pathname
  const pathname = window.location.pathname;
  
  // If pathname starts with /ntm-web/ or is exactly /ntm-web, we're on GitHub Pages
  if (pathname.startsWith('/ntm-web/') || pathname === '/ntm-web') {
    return '/ntm-web';
  }
  
  // Otherwise, no basePath
  return '';
}
