
import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supportedLanguages } from '@/config/supportedLanguages';
import TranslationLoader from '@/components/i18n/TranslationLoader';
import { Skeleton } from '@/components/ui/skeleton';

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
  const langCodes = supportedLanguages.map(l => l.code);
  const isLanguagePrefix = langCodes.includes(firstSegment);
  
  useEffect(() => {
    // Handle routing logic based on URL
    const handleRouteChange = async () => {
      // Avoid recursive redirects
      if (isRedirecting) return;

      if (isLanguagePrefix) {
        // Valid language prefix exists in URL, update language if needed
        if (firstSegment !== currentLanguage) {
          setLanguageByCode(firstSegment, false); // Don't update user profile for URL-based changes
        }
      } else {
        // No valid language prefix, redirect to add the default language prefix
        setIsRedirecting(true);
        
        try {
          const defaultLang = localStorage.getItem('i18nextLng') || 'de';
          const redirectPath = location.pathname === '/' 
            ? `/${defaultLang}` 
            : `/${defaultLang}${location.pathname}`;
          
          navigate(redirectPath, { replace: true });
        } finally {
          // Reset redirecting flag after a short delay to prevent race conditions
          setTimeout(() => {
            setIsRedirecting(false);
          }, 100);
        }
      }
    };

    handleRouteChange();
  }, [location.pathname, firstSegment, isLanguagePrefix, currentLanguage, setLanguageByCode, navigate, isRedirecting]);
  
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
        {langCodes.map(lang => (
          <Route key={lang} path={`/${lang}/*`} element={children} />
        ))}
        <Route path="/" element={<Navigate to={`/${currentLanguage}`} replace />} />
        <Route path="*" element={<Navigate to={`/${currentLanguage}/404`} replace />} />
      </Routes>
    </TranslationLoader>
  );
};

export default EnhancedLanguageRouter;
