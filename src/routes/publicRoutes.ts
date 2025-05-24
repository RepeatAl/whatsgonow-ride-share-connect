
// List of routes that are publicly accessible without authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/register/success',
  '/forgot-password',
  '/reset-password',
  '/faq',
  '/support',
  '/mobile-upload',
  '/upload-complete',
  '/delivery',
  '/invoice-download',
  '/pre-register',
  '/pre-register/success',
  '/legal',
  '/privacy-policy',
  '/payment/status',
];

// Function to check if a route is public with improved language support
export const isPublicRoute = (path: string): boolean => {
  // Remove language prefix for matching
  const pathSegments = path.split('/').filter(Boolean);
  let cleanPath = path;
  
  // If first segment looks like a language code, remove it
  if (pathSegments.length > 0 && pathSegments[0].length === 2) {
    cleanPath = '/' + pathSegments.slice(1).join('/');
    if (cleanPath === '/') cleanPath = '/';
  }
  
  // Check exact matches first
  if (PUBLIC_ROUTES.includes(cleanPath)) return true;
  
  // Check path patterns (like /delivery/:token)
  if (cleanPath.startsWith('/delivery/')) return true;
  if (cleanPath.startsWith('/invoice-download/')) return true;
  if (cleanPath.startsWith('/mobile-upload/')) return true;
  
  return false;
};
