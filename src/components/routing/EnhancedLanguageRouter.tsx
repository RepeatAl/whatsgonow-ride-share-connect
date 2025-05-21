
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supportedLanguages } from '@/config/supportedLanguages';

interface EnhancedLanguageRouterProps {
  children: React.ReactNode;
}

export const EnhancedLanguageRouter: React.FC<EnhancedLanguageRouterProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage, setLanguageByCode } = useLanguage();
  
  // Extract the first part of the path to check if it's a language code
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const langCodes = supportedLanguages.map(l => l.code);
  const isLanguagePrefix = langCodes.includes(firstSegment);
  
  useEffect(() => {
    if (isLanguagePrefix) {
      // If the first part is a valid language code, set it as the current language
      if (firstSegment !== currentLanguage) {
        setLanguageByCode(firstSegment, false); // Don't update user profile for URL-based changes
      }
    } else {
      // If no language prefix, redirect to add the default language prefix
      const defaultLang = localStorage.getItem('i18nextLng') || 'de';
      const redirectPath = location.pathname === '/' 
        ? `/${defaultLang}` 
        : `/${defaultLang}${location.pathname}`;
      
      navigate(redirectPath, { replace: true });
    }
  }, [location.pathname, firstSegment, isLanguagePrefix, currentLanguage, setLanguageByCode, navigate]);
  
  return (
    <Routes>
      {langCodes.map(lang => (
        <Route key={lang} path={`/${lang}/*`} element={children} />
      ))}
      {/* Fallback route for non-language prefixed paths (will redirect in useEffect) */}
      <Route path="*" element={<div>Redirecting...</div>} />
    </Routes>
  );
};

export default EnhancedLanguageRouter;
