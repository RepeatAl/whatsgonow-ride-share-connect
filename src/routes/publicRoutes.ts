
// Define all public routes in the application
// These routes are accessible without authentication

export const publicRoutes = [
  '/delivery', // Diese Route ist öffentlich für QR-Code-Bestätigungen
  '/admin/invoice-test',
  '/invoice-download',
  '/',           // Wichtig: Die Hauptseite muss öffentlich sein
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
];

// Helper function to check if a route is public
export const isPublicRoute = (pathname: string): boolean => {
  // Prüfen ob der Pfad selbst oder einer seiner übergeordneten Pfade öffentlich ist
  return publicRoutes.some(route => {
    // Exakte Übereinstimmung
    if (pathname === route) return true;
    // Prüfen auf Pfade wie '/delivery/xyz'
    if (route.endsWith('/') ? pathname.startsWith(route) : pathname.startsWith(route + '/')) {
      return true;
    }
    return false;
  });
};
