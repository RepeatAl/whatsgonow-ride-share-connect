
import React, { useMemo } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { languageCodes, defaultLanguage } from '@/config/supportedLanguages';
import { determineBestLanguage } from '@/utils/languageUtils';
import { OptimizedLanguageProvider } from '@/contexts/language/OptimizedLanguageProvider';
import AppRoutes from './AppRoutes';

/**
 * Master Control Point (MCP) Router
 * Centralized routing controller that handles all high-level routing decisions
 * including language detection, URL validation, and provider setup
 */
export const MCPRouter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract language and path from current location
  const { language, cleanPath, needsRedirect, redirectPath } = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    // Check if first segment is a valid language code
    const isValidLanguage = languageCodes.includes(firstSegment);
    
    if (isValidLanguage) {
      return {
        language: firstSegment,
        cleanPath: '/' + pathSegments.slice(1).join('/') || '/',
        needsRedirect: false,
        redirectPath: null
      };
    }
    
    // No language prefix - determine best language and redirect
    const bestLanguage = determineBestLanguage(
      navigator.language?.split('-')[0],
      localStorage.getItem('i18nextLng')
    );
    
    return {
      language: bestLanguage,
      cleanPath: location.pathname,
      needsRedirect: true,
      redirectPath: `/${bestLanguage}${location.pathname === '/' ? '' : location.pathname}`
    };
  }, [location.pathname]);

  // Handle redirects for missing language prefix
  if (needsRedirect && redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render app with proper language context
  return (
    <OptimizedLanguageProvider initialLanguage={language}>
      <AppRoutes />
    </OptimizedLanguageProvider>
  );
};

export default MCPRouter;
