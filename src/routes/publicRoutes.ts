
// src/routes/publicRoutes.ts
/**
 * Central definition of public routes
 * These routes are accessible without authentication
 */

export const publicRoutes = [
  '/',
  '/home',
  '/about',
  '/faq',
  '/support',
  '/login',
  '/register',
  '/register/success',
  '/pre-register',
  '/pre-register/success',
  '/forgot-password',
  '/reset-password',
  '/esg-dashboard',
  '/here-maps-demo',
  '/here-maps-features',
  '/mobile-upload',
  '/upload-complete',
  '/delivery',
  '/invoice-download',
  '/404',
];

/**
 * Check if a route is public (accessible without authentication)
 * @param path - The path to check
 * @returns boolean - true if the route is public
 */
export const isPublicRoute = (path: string): boolean => {
  // Remove language prefix for matching
  const pathParts = path.split('/').filter(Boolean);
  
  // Handle root path
  if (pathParts.length === 0) return true;
  
  // If first part is language code, check the rest
  const supportedLanguages = ['de', 'en', 'ar', 'pl', 'fr'];
  let pathToCheck = path;
  
  if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
    pathToCheck = pathParts.length === 1 ? '/' : `/${pathParts.slice(1).join('/')}`;
  }
  
  // Check exact matches first
  if (publicRoutes.includes(pathToCheck)) return true;
  
  // Check path patterns (like /delivery/:token)
  if (pathToCheck.startsWith('/delivery/')) return true;
  if (pathToCheck.startsWith('/invoice-download/')) return true;
  if (pathToCheck.startsWith('/mobile-upload/')) return true;
  
  return false;
};
