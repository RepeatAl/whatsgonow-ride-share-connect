
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
];

// Function to check if a route is public
export const isPublicRoute = (path: string): boolean => {
  // Check exact matches first
  if (PUBLIC_ROUTES.includes(path)) return true;
  
  // Check path patterns (like /delivery/:token)
  if (path.startsWith('/delivery/')) return true;
  if (path.startsWith('/invoice-download/')) return true;
  if (path.startsWith('/mobile-upload/')) return true;
  
  return false;
};
