/**
 * Get the base path for the application
 * Returns '/ntm-web' in production, empty string in development
 */
export function getBasePath(): string {
  return process.env.NODE_ENV === 'production' ? '/ntm-web' : '';
}

/**
 * Navigate to a path with proper basePath handling
 */
export function navigateTo(path: string): void {
  const basePath = getBasePath();
  window.location.href = `${basePath}${path}`;
}

/**
 * Get full URL with basePath
 */
export function getFullPath(path: string): string {
  const basePath = getBasePath();
  return `${basePath}${path}`;
}
