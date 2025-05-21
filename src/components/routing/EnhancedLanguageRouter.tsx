
import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/language';
import { supportedLanguages, defaultLanguage } from '@/config/supportedLanguages';
import TranslationLoader from '@/components/i18n/TranslationLoader';
import { Skeleton } from '@/components/ui/skeleton';
import { languageCodes } from '@/config/supportedLanguages';
import { extractLanguageFromUrl, removeLanguageFromUrl, addLanguageToUrl } from '@/contexts/language/utils';
import { isImplementedLanguage, getLanguageByCode } from '@/utils/languageUtils';
import NotFound from '@/pages/NotFound';

interface EnhancedLanguageRouterProps {
  children: React.ReactNode;
}

export const EnhancedLanguageRouter: React.FC<EnhancedLanguageRouterProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage, setLanguageByCode } = useLanguage();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Extract the first part of the path to check if it's a language code
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const isLanguagePrefix = languageCodes.includes(firstSegment);
  const isValidRoute = location.pathname !== "/404";
  
  useEffect(() => {
    // Handle routing logic based on URL
    const handleRouteChange = async () => {
      // Avoid recursive redirects
      if (isRedirecting) return;

      if (isLanguagePrefix) {
        // Check if the language in URL is different from current language
        if (firstSegment !== currentLanguage) {
          // Valid language prefix exists in URL, update language
          console.log(`[LANG-ROUTER] Updating language from URL: ${firstSegment}`);
          setLanguageByCode(firstSegment, false); // Don't update user profile for URL-based changes
        }
      } else if (isValidRoute) {
        // No valid language prefix, redirect to add language prefix
        setIsRedirecting(true);
        
        try {
          // Try to determine best language from user preferences
          const browserLang = navigator.language?.split('-')[0];
          const storedLang = localStorage.getItem('i18nextLng');
          
          // Prioritize: localStorage > browser language > default language
          let bestLang = defaultLanguage;
          
          if (storedLang && languageCodes.includes(storedLang)) {
            bestLang = storedLang;
          } else if (browserLang && languageCodes.includes(browserLang)) {
            bestLang = browserLang;
          }
          
          // Create the redirect path with language prefix
          const redirectPath = location.pathname === '/' 
            ? `/${bestLang}` 
            : `/${bestLang}${location.pathname}`;
          
          console.log(`[LANG-ROUTER] Redirecting to: ${redirectPath} (from ${location.pathname})`);
          navigate(redirectPath + location.search, { replace: true });
        } catch (error) {
          console.error('[LANG-ROUTER] Error during language redirect:', error);
          // Fallback to default language in case of error
          navigate(`/${defaultLanguage}${location.pathname}`, { replace: true });
        } finally {
          // Reset redirecting flag after a short delay to prevent race conditions
          setTimeout(() => {
            setIsRedirecting(false);
          }, 100);
        }
      }
    };

    handleRouteChange();
  }, [location.pathname, firstSegment, isLanguagePrefix, currentLanguage, setLanguageByCode, navigate, isRedirecting, isValidRoute]);
  
  // Determine which namespaces to load based on the current route
  const getRequiredNamespaces = () => {
    const path = location.pathname.toLowerCase();
    const baseNamespaces = ['common'];
    
    if (path.includes('/dashboard')) return [...baseNamespaces, 'dashboard'];
    if (path.includes('/profile')) return [...baseNamespaces, 'auth'];
    if (path.includes('/faq')) return [...baseNamespaces, 'faq'];
    if (path.includes('/pre-register')) return [...baseNamespaces, 'pre_register'];
    if (path.includes('/login') || path.includes('/register')) return [...baseNamespaces, 'auth'];
    if (path.includes('/feedback')) return [...baseNamespaces, 'feedback'];
    
    return [...baseNamespaces, 'landing'];
  };
  
  // If we're redirecting, show minimal loading UI
  if (isRedirecting) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-brand-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p>Redirecting...</p>
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
        {languageCodes.map(lang => (
          <Route key={lang} path={`/${lang}/*`} element={children} />
        ))}
        
        {/* Root path redirects to default language */}
        <Route path="/" element={<Navigate to={`/${currentLanguage}`} replace />} />
        
        {/* Invalid language code redirects to default language with same path */}
        <Route path="/:invalidLang/*" element={
          <LanguageRedirect />
        } />
        
        {/* Catch-all route for true 404s */}
        <Route path="*" element={<Navigate to={`/${currentLanguage}/404`} replace />} />
      </Routes>
    </TranslationLoader>
  );
};

// Component to handle invalid language redirects
const LanguageRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const invalidLang = pathSegments[0];
  
  useEffect(() => {
    if (!languageCodes.includes(invalidLang)) {
      // Remove the invalid language code and prepend default language
      const cleanPath = '/' + pathSegments.slice(1).join('/');
      const redirectPath = `/${defaultLanguage}${cleanPath}`;
      
      console.warn(`[LANG-ROUTER] Invalid language code: "${invalidLang}" - Redirecting to ${redirectPath}`);
      navigate(redirectPath, { replace: true });
    }
  }, [invalidLang, navigate, pathSegments]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-brand-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
        <p>Redirecting to valid language...</p>
      </div>
    </div>
  );
};

export default EnhancedLanguageRouter;
