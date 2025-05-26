
// List of routes that are publicly accessible without authentication
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/login',
  '/register',
  '/register/success',
  '/pre-register',
  '/pre-register/success',
  '/forgot-password',
  '/reset-password',
  '/faq',
  '/support',
  '/mobile-upload',
  '/upload-complete',
  '/delivery',
  '/invoice-download',
  '/legal',
  '/privacy-policy',
  '/payment/status',
  '/esg-dashboard',
];

// Function to check if a route is public with improved language support
export const isPublicRoute = (path: string): boolean => {
  console.log('[publicRoutes] Checking if path is public:', path);
  
  // Remove language prefix for matching
  const pathSegments = path.split('/').filter(Boolean);
  let cleanPath = path;
  
  // If first segment looks like a language code, remove it
  if (pathSegments.length > 0 && pathSegments[0].length === 2) {
    cleanPath = '/' + pathSegments.slice(1).join('/');
    if (cleanPath === '/') cleanPath = '/';
  }
  
  console.log('[publicRoutes] Clean path for checking:', cleanPath);
  
  // Check exact matches first
  if (PUBLIC_ROUTES.includes(cleanPath)) {
    console.log('[publicRoutes] Found exact match for:', cleanPath);
    return true;
  }
  
  // Check path patterns (like /delivery/:token)
  if (cleanPath.startsWith('/delivery/')) {
    console.log('[publicRoutes] Matched delivery pattern');
    return true;
  }
  if (cleanPath.startsWith('/invoice-download/')) {
    console.log('[publicRoutes] Matched invoice-download pattern');
    return true;
  }
  if (cleanPath.startsWith('/mobile-upload/')) {
    console.log('[publicRoutes] Matched mobile-upload pattern');
    return true;
  }
  if (cleanPath.startsWith('/pre-register')) {
    console.log('[publicRoutes] Matched pre-register pattern');
    return true;
  }
  
  console.log('[publicRoutes] No match found for:', cleanPath);
  return false;
};
