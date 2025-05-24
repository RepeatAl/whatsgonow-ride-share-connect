
import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useOptimizedLanguage } from '@/contexts/language/OptimizedLanguageProvider';
import { supportedLanguages, defaultLanguage } from '@/config/supportedLanguages';
import TranslationLoader from '@/components/i18n/TranslationLoader';
import { Skeleton } from '@/components/ui/skeleton';
import { languageCodes } from '@/config/supportedLanguages';
import { extractLanguageFromUrl, removeLanguageFromUrl, addLanguageToUrl } from '@/contexts/language/utils';
import { isImplementedLanguage, getLanguageByCode, determineBestLanguage } from '@/utils/languageUtils';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import NotFound from '@/pages/NotFound';
import { isPublicRoute } from '@/routes/publicRoutes';

interface EnhancedLanguageRouterProps {
  children: React.ReactNode;
}

export const EnhancedLanguageRouter: React.FC<EnhancedLanguageRouterProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage, setLanguageByCode } = useOptimizedLanguage();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showUnsupportedLanguageAlert, setShowUnsupportedLanguageAlert] = useState(false);
  const [unsupportedCode, setUnsupportedCode] = useState<string | null>(null);
  
  // Extract the first part of the path to check if it's a language code
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const isLanguagePrefix = languageCodes.includes(firstSegment);
  const isValidRoute = location.pathname !== "/404";
  
  // Determine best language based on user preferences
  const getBestLanguage = useCallback(() => {
    const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
    const storedLang = localStorage.getItem('i18nextLng');
    
    // Try to find the best language based on browser and stored preferences
    return determineBestLanguage(browserLang, storedLang);
  }, []);
  
  // Handle showing alert for unsupported language
  useEffect(() => {
    if (unsupportedCode) {
      setShowUnsupportedLanguageAlert(true);
      
      // Auto-hide the alert after 5 seconds
      const timer = setTimeout(() => {
        setShowUnsupportedLanguageAlert(false);
        setUnsupportedCode(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [unsupportedCode]);
  
  useEffect(() => {
    // Handle routing logic based on URL
    const handleRouteChange = async () => {
      // Avoid recursive redirects
      if (isRedirecting) return;

      // Check if path includes language code
      if (isLanguagePrefix) {
        const langMetadata = getLanguageByCode(firstSegment);
        
        // Check if language exists but is not implemented
        if (langMetadata && !langMetadata.implemented) {
          console.warn(`[LANG-ROUTER] Language ${firstSegment} exists but is not implemented yet.`);
          // We allow the route but show a warning
          if (firstSegment !== currentLanguage) {
            // Still set it as current language to maintain URL integrity
            await setLanguageByCode(firstSegment, false);
          }
        } 
        // Check if language exists and is implemented
        else if (langMetadata && langMetadata.implemented) {
          // Valid language prefix exists in URL, update language if different
          if (firstSegment !== currentLanguage) {
            console.log(`[LANG-ROUTER] Updating language from URL: ${firstSegment}`);
            await setLanguageByCode(firstSegment, false); // Don't update user profile for URL-based changes
          }
        }
        // If invalid language code, redirect to default or best language
        else if (!langMetadata) {
          setIsRedirecting(true);
          setUnsupportedCode(firstSegment);
          
          try {
            // Keep path but change language code
            const bestLang = getBestLanguage();
            const pathWithoutLang = '/' + pathSegments.slice(1).join('/');
            const redirectPath = `/${bestLang}${pathWithoutLang}`;
            
            console.warn(`[LANG-ROUTER] Invalid language code: ${firstSegment}, redirecting to ${redirectPath}`);
            navigate(redirectPath, { replace: true });
          } catch (error) {
            console.error('[LANG-ROUTER] Error handling invalid language:', error);
          } finally {
            setTimeout(() => setIsRedirecting(false), 100);
          }
        }
      } 
      // No language prefix in URL
      else if (isValidRoute && !pathSegments.includes('404')) {
        // Check if this is a public route before redirecting
        const cleanPath = location.pathname;
        
        if (isPublicRoute(cleanPath) || cleanPath === '/') {
          setIsRedirecting(true);
          
          try {
            // Determine best language and redirect
            const bestLang = getBestLanguage();
            const redirectPath = location.pathname === '/' 
              ? `/${bestLang}` 
              : `/${bestLang}${location.pathname}`;
            
            console.log(`[LANG-ROUTER] Adding language prefix to public route: ${redirectPath} (from ${location.pathname})`);
            navigate(redirectPath + location.search, { replace: true });
          } catch (error) {
            console.error('[LANG-ROUTER] Error during language redirect:', error);
            // Fallback to default language
            navigate(`/${defaultLanguage}${location.pathname}`, { replace: true });
          } finally {
            setTimeout(() => setIsRedirecting(false), 100);
          }
        }
      }
    };

    handleRouteChange();
  }, [
    location.pathname, 
    firstSegment, 
    isLanguagePrefix, 
    currentLanguage, 
    setLanguageByCode, 
    navigate, 
    isRedirecting, 
    isValidRoute,
    getBestLanguage
  ]);
  
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
    <>
      {/* Unsupported language alert */}
      {showUnsupportedLanguageAlert && (
        <Alert variant="destructive" className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top-5 duration-300">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Language not supported</AlertTitle>
          <AlertDescription>
            The language code "{unsupportedCode}" is not supported. You have been redirected to {currentLanguage}.
          </AlertDescription>
        </Alert>
      )}
      
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
          
          {/* Root path redirects to best language */}
          <Route path="/" element={<Navigate to={`/${currentLanguage}`} replace />} />
          
          {/* Invalid language code redirects to default language with same path */}
          <Route path="/:invalidLang/*" element={
            <LanguageRedirect getBestLanguage={getBestLanguage} />
          } />
          
          {/* Catch-all route for true 404s */}
          <Route path="*" element={<Navigate to={`/${currentLanguage}/404`} replace />} />
        </Routes>
      </TranslationLoader>
    </>
  );
};

// Component to handle invalid language redirects
const LanguageRedirect: React.FC<{getBestLanguage: () => string}> = ({ getBestLanguage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const invalidLang = pathSegments[0];
  
  useEffect(() => {
    if (!languageCodes.includes(invalidLang)) {
      // Remove the invalid language code and prepend best language
      const cleanPath = '/' + pathSegments.slice(1).join('/');
      const bestLang = getBestLanguage();
      const redirectPath = `/${bestLang}${cleanPath}`;
      
      console.warn(`[LANG-ROUTER] Invalid language code: "${invalidLang}" - Redirecting to ${redirectPath}`);
      navigate(redirectPath, { replace: true });
    }
  }, [invalidLang, navigate, pathSegments, getBestLanguage]);
  
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
