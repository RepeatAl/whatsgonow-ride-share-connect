
import React, { useMemo } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useOptimizedLanguage } from '@/contexts/language/OptimizedLanguageProvider';
import { defaultLanguage } from '@/config/supportedLanguages';
import TranslationLoader from '@/components/i18n/TranslationLoader';
import { Skeleton } from '@/components/ui/skeleton';
import { languageCodes } from '@/config/supportedLanguages';
import { getLanguageByCode, determineBestLanguage } from '@/utils/languageUtils';

interface StabilizedLanguageRouterProps {
  children: React.ReactNode;
}

export const StabilizedLanguageRouter: React.FC<StabilizedLanguageRouterProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage } = useOptimizedLanguage();
  
  // Extract the first part of the path to check if it's a language code
  const pathSegments = useMemo(() => location.pathname.split('/').filter(Boolean), [location.pathname]);
  const firstSegment = pathSegments[0];
  const isLanguagePrefix = languageCodes.includes(firstSegment);
  
  console.log('[StabilizedRouter] === SIMPLIFIED DEBUG ===');
  console.log('[StabilizedRouter] Current path:', location.pathname);
  console.log('[StabilizedRouter] First segment:', firstSegment);
  console.log('[StabilizedRouter] Is language prefix:', isLanguagePrefix);
  console.log('[StabilizedRouter] Current language:', currentLanguage);
  
  // Determine best language based on user preferences - memoized
  const getBestLanguage = () => {
    const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
    const storedLang = localStorage.getItem('i18nextLng');
    return determineBestLanguage(browserLang, storedLang);
  };

  // Memoize required namespaces based on route
  const getRequiredNamespaces = () => {
    const path = location.pathname.toLowerCase();
    const baseNamespaces = ['common'];
    
    if (path.includes('/dashboard')) return [...baseNamespaces, 'dashboard'];
    if (path.includes('/profile')) return [...baseNamespaces, 'auth'];
    if (path.includes('/faq')) return [...baseNamespaces, 'faq'];
    if (path.includes('/pre-register')) return [...baseNamespaces, 'pre_register', 'errors'];
    if (path.includes('/login') || path.includes('/register')) return [...baseNamespaces, 'auth'];
    if (path.includes('/feedback')) return [...baseNamespaces, 'feedback'];
    
    return [...baseNamespaces, 'landing'];
  };

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
        {/* Language-prefixed routes - simplified to just pass through to children */}
        {languageCodes.map(lang => {
          console.log(`[StabilizedRouter] Setting up route for language: ${lang}`);
          return (
            <Route key={lang} path={`/${lang}/*`} element={children} />
          );
        })}
        
        {/* Root path redirects to best language - ONLY for root */}
        <Route path="/" element={
          (() => {
            const bestLang = getBestLanguage();
            console.log('[StabilizedRouter] Root redirect to:', `/${bestLang}`);
            navigate(`/${bestLang}`, { replace: true });
            return null;
          })()
        } />
        
        {/* Catch unmatched paths and redirect with language prefix */}
        <Route path="*" element={
          (() => {
            if (!isLanguagePrefix && location.pathname !== '/') {
              const bestLang = getBestLanguage();
              const redirectPath = `/${bestLang}${location.pathname}`;
              console.log('[StabilizedRouter] Adding language prefix:', redirectPath);
              navigate(redirectPath, { replace: true });
              return null;
            }
            // If we have a language prefix but still hit this route, let AppRoutes handle it
            return children;
          })()
        } />
      </Routes>
    </TranslationLoader>
  );
};

export default StabilizedLanguageRouter;
