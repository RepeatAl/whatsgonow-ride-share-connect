/**
 * Public Routes für das Public-First Auth-System
 * 
 * Diese Routen sind für alle Nutzer zugänglich, auch ohne Anmeldung.
 * Auth-Checks erfolgen nur noch auf Action-Ebene über AuthRequired-Komponente.
 * 
 * Stand: 08. Juni 2025 - Aktualisiert mit vollständiger Public-First-Logik
 */

export const publicRoutes = [
  // === HAUPT-NAVIGATION (öffentlich) ===
  '/',
  '/home',
  '/about',
  '/faq',
  '/support',
  
  // === LEGAL & POLICY PAGES (CRITICAL FIX) ===
  '/legal',
  '/imprint',
  '/privacy-policy',
  '/terms-of-service',
  
  // === AUTH-SEITEN ===
  '/login',
  '/register',
  '/register/success',
  '/pre-register',           // Anonyme Vorregistrierung
  '/pre-register/success',   // ENHANCED: Success page for pre-registration
  '/forgot-password',
  '/reset-password',
  
  // === ÖFFENTLICHE FEATURES (Public First) ===
  '/transport-search',       // Transport suchen - vollständig öffentlich
  '/items-browse',          // Artikel durchsuchen - öffentlich
  '/rides-public',          // Mitfahrgelegenheiten ansehen - öffentlich
  '/map-view',              // Kartenansicht - öffentlich
  '/video-gallery',         // How-to-Videos - öffentlich
  '/esg-dashboard',         // ESG-Übersicht - öffentlich
  
  // === DEMO & ENTWICKLUNG ===
  '/here-maps-demo',
  '/here-maps-features',
  
  // === UTILITY-SEITEN ===
  '/mobile-upload',         // Upload-Vorbereitung ohne Login
  '/upload-complete',
  '/delivery',              // Token-basierte Zustellung
  '/invoice-download',      // Token-basierter Download
  '/404',
];

/**
 * Geschützte Routen - benötigen ProtectedRoute  
 * Alle anderen werden über AuthRequired auf Action-Ebene geschützt
 */
export const protectedRoutes = [
  '/dashboard',              // Dashboard (alle Rollen)
  '/dashboard/sender',       // Sender Dashboard
  '/dashboard/driver',       // Driver Dashboard  
  '/dashboard/cm',           // Community Manager Dashboard
  '/dashboard/admin',        // Admin Dashboard
  '/profile',               // Profile bearbeiten
  '/complete-profile',      // Profil vervollständigen
  '/messages',              // Chat/Messages
  '/inbox',                 // Inbox/Nachrichten
  '/admin',                 // Admin-Bereich
  '/system-tests',          // Entwickler-Tools
  '/rls-test',              // RLS-Tests
];

/**
 * ENHANCED: Routes that remain accessible even after login (Public First principle)
 * CRITICAL: Diese Routen bleiben auch nach Login verfügbar - BESONDERS VIDEOS
 */
export const alwaysPublicRoutes = [
  '/faq',
  '/about', 
  '/support',
  '/transport-search',
  '/items-browse',
  '/rides-public',
  '/map-view',
  '/video-gallery',         // CRITICAL: Videos müssen immer zugänglich sein
  '/esg-dashboard',
  '/here-maps-demo',        // Demo-Seiten bleiben zugänglich
  '/here-maps-features'
];

/**
 * Pre-Registration spezifische Routen
 * Diese sind komplett anonym zugänglich
 */
export const preRegisterRoutes = [
  '/pre-register',
  '/pre-register/success'
];

/**
 * Upload-Routen (Public First Konzept)
 * Vorbereitung ohne Login, Speichern erfordert Auth
 */
export const uploadRoutes = [
  '/mobile-upload',         // Vorbereitung öffentlich
  '/upload-complete',       // Bestätigung öffentlich
  // Speichern/Veröffentlichen über AuthRequired geschützt
];

/**
 * Token-basierte öffentliche Routen
 * Authentifizierung über sichere Token statt Login
 */
export const tokenBasedRoutes = [
  '/delivery',              // Zustellbestätigung
  '/invoice-download',      // Rechnungsdownload
];

/**
 * Prüft ob eine Route öffentlich ist (Public First)
 */
export const isPublicRoute = (path: string): boolean => {
  // Entferne Sprachpräfix für Matching
  const pathParts = path.split('/').filter(Boolean);
  
  // Wurzel-Pfad ist öffentlich
  if (pathParts.length === 0) return true;
  
  // Wenn erstes Segment Sprache ist, prüfe den Rest
  const supportedLanguages = ['de', 'en', 'ar', 'pl', 'fr', 'es', 'cs'];
  let pathToCheck = path;
  
  if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
    pathToCheck = pathParts.length === 1 ? '/' : `/${pathParts.slice(1).join('/')}`;
  }
  
  // Direkte Matches
  if (publicRoutes.includes(pathToCheck)) return true;
  
  // Pattern-Matches für dynamische Routen
  if (pathToCheck.startsWith('/delivery/')) return true;
  if (pathToCheck.startsWith('/invoice-download/')) return true;
  if (pathToCheck.startsWith('/mobile-upload/')) return true;
  
  return false;
};

/**
 * ENHANCED: Check if route should remain public even after login
 * CRITICAL: Videos und Demo-Seiten bleiben IMMER zugänglich
 */
export const isAlwaysPublicRoute = (path: string): boolean => {
  const pathParts = path.split('/').filter(Boolean);
  const supportedLanguages = ['de', 'en', 'ar', 'pl', 'fr', 'es', 'cs'];
  let pathToCheck = path;
  
  if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
    pathToCheck = pathParts.length === 1 ? '/' : `/${pathParts.slice(1).join('/')}`;
  }
  
  return alwaysPublicRoutes.some(route => pathToCheck.startsWith(route));
};

/**
 * Prüft ob eine Route geschützt ist und ProtectedRoute benötigt
 */
export const isProtectedRoute = (path: string): boolean => {
  // Entferne Sprachpräfix
  const pathParts = path.split('/').filter(Boolean);
  const supportedLanguages = ['de', 'en', 'ar', 'pl', 'fr', 'es', 'cs'];
  let pathToCheck = path;
  
  if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
    pathToCheck = pathParts.length === 1 ? '/' : `/${pathParts.slice(1).join('/')}`;
  }
  
  // Direkte Matches für geschützte Routen
  return protectedRoutes.some(route => pathToCheck.startsWith(route));
};

/**
 * Prüft ob eine Route Pre-Registration ist (völlig anonym)
 */
export const isPreRegisterRoute = (path: string): boolean => {
  const pathParts = path.split('/').filter(Boolean);
  const supportedLanguages = ['de', 'en', 'ar', 'pl', 'fr', 'es', 'cs'];
  let pathToCheck = path;
  
  if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
    pathToCheck = pathParts.length === 1 ? '/' : `/${pathParts.slice(1).join('/')}`;
  }
  
  return preRegisterRoutes.some(route => pathToCheck.startsWith(route));
};

/**
 * Route-Kategorien für bessere Organisation
 */
export const routeCategories = {
  public: publicRoutes,
  protected: protectedRoutes,
  preRegister: preRegisterRoutes,
  upload: uploadRoutes,
  tokenBased: tokenBasedRoutes,
  alwaysPublic: alwaysPublicRoutes // ENHANCED: Always accessible routes
};

/**
 * Hilfsfunktion: Bestimme benötigte Auth-Stufe für Route
 */
export const getAuthRequirement = (path: string): 'none' | 'token' | 'authenticated' | 'role_specific' => {
  if (isPublicRoute(path)) return 'none';
  if (tokenBasedRoutes.some(route => path.startsWith(route))) return 'token';
  if (isProtectedRoute(path)) {
    // Prüfe ob rollenspezifisch
    if (path.includes('/admin') || path.includes('/cm')) return 'role_specific';
    return 'authenticated';
  }
  return 'none'; // Fallback für unbekannte Routen
};
