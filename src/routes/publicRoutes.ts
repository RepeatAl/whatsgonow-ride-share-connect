/**
 * Public Routes Configuration
 * Defines which routes are accessible without authentication
 */

export const publicPaths = [
  '/',
  '/home', 
  '/about',
  '/faq',
  '/login',
  '/register',
  '/register/success',
  '/pre-register',
  '/pre-register/success',
  '/forgot-password',
  '/reset-password',
  '/esg-dashboard',
  '/here-maps-demo',
  '/here-maps-features'  // NEW: Feature demo page
];

/**
 * Language-aware path patterns
 */
export const languageAwarePatterns = [
  /^\/[a-z]{2}$/,           // /de, /en, /ar
  /^\/[a-z]{2}\/.*$/        // /de/*, /en/*, /ar/*
];

/**
 * Checks if a given path is a public route
 */
export function isPublicRoute(path: string): boolean {
  console.log('[publicRoutes] Checking if path is public:', path);
  
  // Remove language prefix for checking
  let cleanPath = path;
  
  // Check if path matches language pattern
  const hasLanguagePrefix = languageAwarePatterns.some(pattern => pattern.test(path));
  
  if (hasLanguagePrefix) {
    // Remove language prefix (e.g., /de/about -> /about)
    cleanPath = path.replace(/^\/[a-z]{2}/, '') || '/';
  }
  
  console.log('[publicRoutes] Clean path for checking:', cleanPath);
  
  // Check against public paths
  const isPublic = publicPaths.some(publicPath => {
    if (publicPath === '/') {
      return cleanPath === '/';
    }
    return cleanPath === publicPath || cleanPath.startsWith(publicPath + '/');
  });
  
  if (isPublic) {
    console.log('[publicRoutes] Found exact match for:', cleanPath);
  }
  
  return isPublic;
}
