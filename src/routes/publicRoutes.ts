
/**
 * Defines all public routes of the application.
 * These paths are accessible without authentication.
 */
export const publicRoutes = [
  "/login",
  "/register", 
  "/pre-register",
  "/pre-register/success",
  "/delivery",
  "/invoice-download",
  "/forgot-password", 
  "/reset-password",
  "/faq",
  "/support"
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

  // Check for dynamic routes with parameters
  return publicRoutes.some(route => {
    if (route === "/") return false; // Skip root path for parameter check
    return pathname.startsWith(route + "/");
  });
};

/**
 * Check if a route is a home/landing page route
 * These are technically public but need special handling
 */
export const isHomeRoute = (pathname: string): boolean => {
  return pathname === "/";
};
