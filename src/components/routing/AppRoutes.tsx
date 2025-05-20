
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { PublicRoute } from "@/components/routing/PublicRoute";
import { ProfileCheck } from "@/components/profile/ProfileCheck";
import { routes } from "@/routes/routes";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { LanguageRouter } from "@/components/routing/LanguageRouter";
import { supportedLanguages } from "@/config/supportedLanguages";
import { useLanguage } from "@/contexts/LanguageContext";

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  public?: boolean;
  protected?: boolean;
  children?: RouteConfig[];
}

export const AppRoutes = () => {
  const { getLanguageFromUrl } = useLanguage();
  
  // Helper function to create language-prefixed routes
  const createLanguageRoutes = (baseRoutes: RouteConfig[]) => {
    // Get the supported language codes
    const languageCodes = supportedLanguages.map(lang => lang.code);
    
    return (
      <>
        {/* Default redirect route - Redirects root URL to preferred language */}
        <Route
          path="/"
          element={<LanguageRouter><Navigate to="/de" /></LanguageRouter>}
        />
        
        {/* Generate routes for each language prefix */}
        {languageCodes.map(langCode => (
          <Route key={langCode} path={`/${langCode}/*`} element={
            <Routes>
              {/* Handle root path for language */}
              <Route 
                path="/"
                element={<PublicRoute>{routes.find(r => r.path === "/")?.element}</PublicRoute>}
              />
              
              {/* Generate all routes for this language prefix */}
              {baseRoutes.map(({ path, element, public: isPublic, protected: isProtected }) => {
                if (path === "/") return null; // Skip root path, already handled above
                
                const langPath = path.startsWith("/") ? path.substring(1) : path;
                
                if (isPublic) {
                  // Public routes are accessible without authentication
                  return (
                    <Route 
                      key={`${langCode}-${path}`}
                      path={langPath}
                      element={<PublicRoute>{element}</PublicRoute>}
                    />
                  );
                }
                
                // Protected routes need authentication and profile check
                return (
                  <Route
                    key={`${langCode}-${path}`}
                    path={langPath}
                    element={
                      <ProtectedRoute>
                        <ProfileCheck>{element}</ProfileCheck>
                      </ProtectedRoute>
                    }
                  />
                );
              })}
              
              {/* Fallback route for language - redirect to not found */}
              <Route path="*" element={<Navigate to={`/${langCode}/not-found`} replace />} />
            </Routes>
          } />
        ))}
        
        {/* Redirect non-language URLs to default language */}
        <Route path="*" element={<Navigate to="/de" replace />} />
      </>
    );
  };

  return (
    <Suspense fallback={<LoadingScreen message="Seite wird geladen..." />}>
      <Routes>
        {createLanguageRoutes(routes)}
      </Routes>
    </Suspense>
  );
};
