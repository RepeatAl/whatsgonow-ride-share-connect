
/**
 * Definiert alle öffentlichen Routen der Anwendung.
 * Diese Pfade sind ohne Anmeldung zugänglich.
 */
export const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/faq",
  "/support",
  "/delivery",          // deckt /delivery/:token ab
  "/invoice-download",  // deckt /invoice-download/:token ab
  "/pre-register",
  "/pre-register/success"
];

/**
 * Prüft, ob ein gegebener Pfad eine öffentliche Route ist.
 * @param pathname aktueller Pfad aus window.location.pathname
 * @returns true, wenn die Route öffentlich ist
 */
export const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some(route => {
    // exakte Übereinstimmung, z. B. "/login"
    if (pathname === route) return true;
    // Parameter-Routen: "/delivery/:token" oder "/invoice-download/:token"
    return pathname.startsWith(route + "/");
  });
};
