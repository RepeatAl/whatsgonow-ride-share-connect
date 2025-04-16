
// Define all public routes in the application
// These routes are accessible without authentication

export const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/faq',
  '/support',
  '/delivery',  // For QR-Code confirmations
  '/invoice-download',
  '/admin/invoice-test'
];

// Helper function to check if a route is public
export const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some(route => {
    // Exact match
    if (pathname === route) return true;
    // Check for paths like '/delivery/xyz'
    if (route.endsWith('/') ? pathname.startsWith(route) : pathname.startsWith(route + '/')) {
      return true;
    }
    return false;
  });
};
