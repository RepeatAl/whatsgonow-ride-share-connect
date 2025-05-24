
import React, { useMemo } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { languageCodes } from '@/config/supportedLanguages';
import { determineBestLanguage } from '@/utils/languageUtils';
import { LanguageMCP } from '@/mcp/language/LanguageMCP';
import AppRoutes from './AppRoutes';

/**
 * Simplified MCP Router - Phase 1 Stabilization
 * Focus: Basic language detection without complex redirects
 * Minimal MCP orchestration to prevent provider conflicts
 */
export const MCPRouter: React.FC = () => {
  const location = useLocation();

  console.log('[MCP-ROUTER] Current path:', location.pathname);

  // Simple language extraction - no complex redirect logic
  const { language, shouldRedirect, redirectPath } = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    console.log('[MCP-ROUTER] Path segments:', pathSegments);
    console.log('[MCP-ROUTER] First segment:', firstSegment);
    
    // Check if first segment is a valid language code
    const isValidLanguage = languageCodes.includes(firstSegment);
    
    if (isValidLanguage) {
      console.log('[MCP-ROUTER] Valid language found:', firstSegment);
      return {
        language: firstSegment,
        shouldRedirect: false,
        redirectPath: null
      };
    }
    
    // Only redirect from exact root path - avoid 404 loops
    if (location.pathname === '/' || location.pathname === '') {
      const bestLanguage = determineBestLanguage(
        navigator.language?.split('-')[0],
        localStorage.getItem('i18nextLng')
      );
      
      console.log('[MCP-ROUTER] Redirecting from root to:', bestLanguage);
      return {
        language: bestLanguage,
        shouldRedirect: true,
        redirectPath: `/${bestLanguage}`
      };
    }

    // For any other path (including 404), use default language without redirect
    const defaultLang = 'de';
    console.log('[MCP-ROUTER] Using default language for path:', location.pathname);
    return {
      language: defaultLang,
      shouldRedirect: false,
      redirectPath: null
    };
  }, [location.pathname]);

  // Handle redirect only from root
  if (shouldRedirect && redirectPath) {
    console.log('[MCP-ROUTER] Performing redirect to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  console.log('[MCP-ROUTER] Rendering app with language:', language);

  // Simplified MCP orchestration - only LanguageMCP for now
  return (
    <LanguageMCP initialLanguage={language}>
      <AppRoutes />
    </LanguageMCP>
  );
};

export default MCPRouter;
