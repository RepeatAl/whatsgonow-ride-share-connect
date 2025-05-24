
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useOptimizedLanguage } from '@/contexts/language/OptimizedLanguageProvider';
import { defaultLanguage } from '@/config/supportedLanguages';
import TranslationLoader from '@/components/i18n/TranslationLoader';
import { Skeleton } from '@/components/ui/skeleton';
import { languageCodes } from '@/config/supportedLanguages';
import { getLanguageByCode, determineBestLanguage } from '@/utils/languageUtils';
import { isPublicRoute } from '@/routes/publicRoutes';

interface StabilizedLanguageRouterProps {
  children: React.ReactNode;
}

export const StabilizedLanguageRouter: React.FC<StabilizedLanguageRouterProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage, setLanguageByCode } = useOptimizedLanguage();
  const [isProcessingRoute, setIsProcessingRoute] = useState(false);
  
  // Extract the first part of the path to check if it's a language code
  const pathSegments = useMemo(() => location.pathname.split('/').filter(Boolean), [location.pathname]);
  const firstSegment = pathSegments[0];
  const isLanguagePrefix = languageCodes.includes(firstSegment);
  
  // Debug logging
  console.log('[StabilizedRouter] Current path:', location.pathname);
  console.log('[StabilizedRouter] Path segments:', pathSegments);
  console.log('[StabilizedRouter] First segment:', firstSegment);
  console.log('[StabilizedRouter] Is language prefix:', isLanguagePrefix);
  console.log('[StabilizedRouter] Current language:', currentLanguage);
  
  // Determine best language based on user preferences - memoized
  const getBestLanguage = useCallback(() => {
    const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
    const storedLang = localStorage.getItem('i18nextLng');
    
    return determineBestLanguage(browserLang, storedLang);
  }, []);
  
  // Memoize required namespaces based on route
  const getRequiredNamespaces = useCallback(() => {
    const path = location.pathname.toLowerCase();
    const baseNamespaces = ['common'];
    
    if (path.includes('/dashboard')) return [...baseNamespaces, 'dashboard'];
    if (path.includes('/profile')) return [...baseNamespaces, 'auth'];
    if (path.includes('/faq')) return [...baseNamespaces, 'faq'];
    if (path.includes('/pre-register')) return [...baseNamespaces, 'pre_register'];
    if (path.includes('/login') || path.includes('/register')) return [...baseNamespaces, 'auth'];
    if (path.includes('/feedback')) return [...baseNamespaces, 'feedback'];
    
    return [...baseNamespaces, 'landing'];
  }, [location.pathname]);

  // Handle routing logic with reduced redirects
  useEffect(() => {
    if (isProcessingRoute) return;

    const handleRouteChange = async () => {
      console.log('[StabilizedRouter] Handling route change for:', location.pathname);
      
      // Check if path includes language code
      if (isLanguagePrefix) {
        const langMetadata = getLanguageByCode(firstSegment);
        
        // Valid language prefix exists in URL, update language if different
        if (langMetadata && firstSegment !== currentLanguage) {
          console.log(`[StabilizedRouter] Updating language from URL: ${firstSegment}`);
          setIsProcessingRoute(true);
          await setLanguageByCode(firstSegment, false);
          setIsProcessingRoute(false);
        }
        
        // Check if the route after language prefix is valid
        const pathWithoutLang = '/' + pathSegments.slice(1).join('/');
        const cleanPath = pathWithoutLang === '/' ? '/' : pathWithoutLang;
        console.log('[StabilizedRouter] Path without language:', cleanPath);
        console.log('[StabilizedRouter] Is public route:', isPublicRoute(cleanPath));
        
      } 
      // No language prefix in URL - add it for public routes
      else if (location.pathname !== '/') {
        // Check if this is a public route
        const cleanPath = location.pathname;
        
        if (isPublicRoute(cleanPath) || cleanPath === '/') {
          setIsProcessingRoute(true);
          
          try {
            const bestLang = getBestLanguage();
            const redirectPath = location.pathname === '/' 
              ? `/${bestLang}` 
              : `/${bestLang}${location.pathname}`;
            
            console.log(`[StabilizedRouter] Adding language prefix: ${redirectPath}`);
            navigate(redirectPath + location.search, { replace: true });
          } catch (error) {
            console.error('[StabilizedRouter] Error during language redirect:', error);
            navigate(`/${defaultLanguage}${location.pathname}`, { replace: true });
          } finally {
            setIsProcessingRoute(false);
          }
        }
      }
    };

    // Debounce route changes to prevent rapid redirects
    const timeoutId = setTimeout(handleRouteChange, 50);
    return () => clearTimeout(timeoutId);
  }, [
    location.pathname, 
    firstSegment, 
    isLanguagePrefix, 
    currentLanguage, 
    setLanguageByCode, 
    navigate, 
    isProcessingRoute,
    getBestLanguage,
    pathSegments
  ]);
  
  // If we're processing a route change, show minimal loading
  if (isProcessingRoute) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-t-4 border-brand-primary border-solid rounded-full animate-spin mx-auto mb-2"></div>
        </div>
      </div>
    );
  }

  return (
    <TranslationLoader namespaces={getRequiredNamespaces()} fallback={
      <div className="p-4">
        <Skeleton className="h-16 w-full mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    }>
      <Routes>
        {/* Language-prefixed routes */}
        {languageCodes.map(lang => {
          console.log(`[StabilizedRouter] Setting up route for language: ${lang}`);
          return (
            <Route key={lang} path={`/${lang}/*`} element={children} />
          );
        })}
        
        {/* Root path redirects to best language */}
        <Route path="/" element={<Navigate to={`/${currentLanguage}`} replace />} />
        
        {/* Catch-all route for true 404s */}
        <Route path="*" element={<Navigate to={`/${currentLanguage}/404`} replace />} />
      </Routes>
    </TranslationLoader>
  );
};

export default StabilizedLanguageRouter;
