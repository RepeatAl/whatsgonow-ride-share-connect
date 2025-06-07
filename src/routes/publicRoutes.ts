
/**
 * Vereinfachte Public Routes für das neue "öffentlich vs. geschützt" System
 * 
 * Diese Routen sind für alle Nutzer zugänglich, auch ohne Anmeldung.
 * Auth-Checks erfolgen nur noch auf Action-Ebene über AuthRequired-Komponente.
 */

export const publicRoutes = [
  // Haupt-Navigation (öffentlich)
  '/',
  '/home',
  '/about',
  '/faq',
  '/support',
  
  // Auth-Seiten
  '/login',
  '/register',
  '/register/success',
  '/pre-register',
  '/pre-register/success',
  '/forgot-password',
  '/reset-password',
  
  // Öffentliche Features
  '/transport-search',      // Transport suchen (neu: öffentlich)
  '/items-browse',         // Artikel durchsuchen (neu: öffentlich)
  '/rides-public',         // Mitfahrgelegenheiten ansehen (neu: öffentlich)
  '/esg-dashboard',        // ESG-Übersicht
  '/here-maps-demo',       // Demo-Seiten
  '/here-maps-features',
  
  // Utility-Seiten
  '/mobile-upload',
  '/upload-complete',
  '/delivery',
  '/invoice-download',
  '/404',
];

/**
 * Geschützte Routen - benötigen ProtectedRoute
 * Alle anderen werden über AuthRequired auf Action-Ebene geschützt
 */
export const protectedRoutes = [
  '/dashboard',           // Dashboard (alle Rollen)
  '/dashboard/sender',    // Sender Dashboard
  '/dashboard/driver',    // Driver Dashboard  
  '/dashboard/cm',        // Community Manager Dashboard
  '/dashboard/admin',     // Admin Dashboard
  '/profile',            // Profile bearbeiten
  '/messages',           // Chat/Messages
  '/admin',              // Admin-Bereich
];

/**
 * Prüft ob eine Route öffentlich ist (vereinfacht)
 */
export const isPublicRoute = (path: string): boolean => {
  // Entferne Sprachpräfix für Matching
  const pathParts = path.split('/').filter(Boolean);
  
  // Wurzel-Pfad ist öffentlich
  if (pathParts.length === 0) return true;
  
  // Wenn erstes Segment Sprache ist, prüfe den Rest
  const supportedLanguages = ['de', 'en', 'ar', 'pl', 'fr'];
  let pathToCheck = path;
  
  if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
    pathToCheck = pathParts.length === 1 ? '/' : `/${pathParts.slice(1).join('/')}`;
  }
  
  // Direkte Matches
  if (publicRoutes.includes(pathToCheck)) return true;
  
  // Pattern-Matches (wie /delivery/:token)
  if (pathToCheck.startsWith('/delivery/')) return true;
  if (pathToCheck.startsWith('/invoice-download/')) return true;
  if (pathToCheck.startsWith('/mobile-upload/')) return true;
  
  return false;
};

/**
 * Prüft ob eine Route geschützt ist und ProtectedRoute benötigt
 */
export const isProtectedRoute = (path: string): boolean => {
  // Entferne Sprachpräfix
  const pathParts = path.split('/').filter(Boolean);
  const supportedLanguages = ['de', 'en', 'ar', 'pl', 'fr'];
  let pathToCheck = path;
  
  if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
    pathToCheck = pathParts.length === 1 ? '/' : `/${pathParts.slice(1).join('/')}`;
  }
  
  // Direkte Matches für geschützte Routen
  return protectedRoutes.some(route => pathToCheck.startsWith(route));
};
