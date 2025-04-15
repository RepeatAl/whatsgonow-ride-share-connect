
// Define all public routes in the application
// These routes are accessible without authentication

export const publicRoutes = [
  '/admin/invoice-test',
  '/invoice-download',
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
];

// Helper function to check if a route is public
export const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some(route => pathname.startsWith(route));
};
