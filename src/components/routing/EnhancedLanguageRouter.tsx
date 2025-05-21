
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  const pathParts = location.pathname.split('/').filter(Boolean);
  const firstPart = pathParts[0];
  const langCodes = supportedLanguages.map(l => l.code);
  const isLanguagePrefix = langCodes.includes(firstPart);
  
  // Handle paths with language prefix
  useEffect(() => {
    if (isLanguagePrefix) {
      // If the first part is a valid language code, set it as the current language
      if (firstPart !== currentLanguage) {
        setLanguageByCode(firstPart, false); // Don't update user profile for URL-based changes
      }
    } else {
      // If no language prefix, redirect to add the default language prefix
      const defaultLang = localStorage.getItem('i18nextLng') || 'de';
      let redirectPath = `/${defaultLang}${location.pathname}`;
      
      // Ensure we don't add unnecessary slashes
      redirectPath = redirectPath.replace(/\/+/g, '/');
      
      // Handle special case for root path
      if (location.pathname === '/') {
        redirectPath = `/${defaultLang}`;
      }
      
      // Only redirect if we're not already on the correct path
      if (location.pathname !== redirectPath) {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [location.pathname, firstPart, isLanguagePrefix, currentLanguage, setLanguageByCode, navigate]);
  
  // If this is a root path with a language prefix like /de, /en, etc.
  // redirect to the root of the app with that language
  if (isLanguagePrefix && pathParts.length === 1) {
    // This is a path like /de or /en -> render the actual app's root content
    return (
      <Routes>
        <Route path="/" element={children} />
      </Routes>
    );
  }
  
  // For paths with language prefix that aren't just the language code
  if (isLanguagePrefix) {
    // Remove the language prefix from path for the underlying router
    // If the path is like /de/dashboard, we want the app to see /dashboard
    const restOfPath = '/' + pathParts.slice(1).join('/');
    
    return (
      <Routes>
        <Route path={`/${firstPart}/*`} element={children} />
      </Routes>
    );
  }
  
  // If no language prefix and we're still rendering (waiting for redirect)
  // just render a loading state
  return <div>Loading...</div>;
};

export default EnhancedLanguageRouter;
