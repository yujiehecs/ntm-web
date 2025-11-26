import { getBasePath } from './utils/basePath';

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
