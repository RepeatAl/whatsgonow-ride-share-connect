
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supportedLanguages } from '@/config/supportedLanguages';

interface EnhancedLanguageRouterProps {
  children: React.ReactNode;
}

export const EnhancedLanguageRouter: React.FC<EnhancedLanguageRouterProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLanguageByCode, currentLanguage } = useLanguage();
  
  // Extract language code from URL path
  const extractLanguageFromUrl = (path: string): string | null => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      const potentialLang = segments[0];
      if (supportedLanguages.some(l => l.code === potentialLang)) {
        return potentialLang;
      }
    }
    return null;
  };

  useEffect(() => {
    // Extract language from current URL
    const langFromUrl = extractLanguageFromUrl(location.pathname);
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    if (langFromUrl) {
      // If we have a language in the URL, set it as current language
      if (langFromUrl !== currentLanguage) {
        setLanguageByCode(langFromUrl, false);
      }
      
      // Special case: If URL is just the language prefix (like /de)
      if (pathSegments.length === 1) {
        // Redirect to root within that language
        navigate(`/${langFromUrl}/`, { replace: true });
      }
    } else {
      // If no language in URL, redirect to URL with default language
      const defaultLang = localStorage.getItem('i18nextLng') || 'de';
      const newPath = `/${defaultLang}${location.pathname === '/' ? '' : location.pathname}`;
      navigate(newPath, { replace: true });
    }
  }, [location.pathname, currentLanguage, setLanguageByCode, navigate]);

  // Render children without modifying them
  // AppRoutes will handle the routes without language prefix
  return <>{children}</>;
};

export default EnhancedLanguageRouter;
