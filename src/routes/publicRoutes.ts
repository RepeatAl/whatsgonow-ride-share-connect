
/**
 * Defines all public routes of the application.
 * These paths are accessible without authentication.
 */
export const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/pre-register",
  "/pre-register/success",
  "/faq",  // Added FAQ route to public routes
  "/support"  // Also adding support route for consistency
];

/**
 * Checks if a given path is a public route.
 * @param pathname current path from window.location.pathname
 * @returns true if the route is public
 */
export const isPublicRoute = (pathname: string): boolean => {
  // Check for exact match first
  if (publicRoutes.includes(pathname)) {
    return true;
  }

  // Only allow /pre-register/* paths for dynamic routes
  return pathname.startsWith("/pre-register/");
};

/**
 * Check if a route is a home/landing page route
 */
export const isHomeRoute = (pathname: string): boolean => {
  return pathname === "/";
};

