
import React, { useMemo } from 'react';
import { useLocation, Navigate, Routes, Route } from 'react-router-dom';
import { languageCodes } from '@/config/supportedLanguages';
import { determineBestLanguage } from '@/utils/languageUtils';
import { LanguageMCP } from '@/mcp/language/LanguageMCP';

// Import page components directly for debugging
import Landing from '@/pages/Landing';
import PreRegister from '@/pages/PreRegister';
import NotFound from '@/pages/NotFound';

/**
 * Simplified MCP Router - Debug Version
 * Focus: Basic language detection and routing
 */
export const MCPRouter: React.FC = () => {
  const location = useLocation();

  console.log('[MCP-ROUTER] === ROUTER DEBUG START ===');
  console.log('[MCP-ROUTER] Current path:', location.pathname);
  console.log('[MCP-ROUTER] Search params:', location.search);

  // Simple language extraction with detailed logging
  const { language, shouldRedirect, redirectPath } = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    console.log('[MCP-ROUTER] Path segments:', pathSegments);
    
    const firstSegment = pathSegments[0];
    console.log('[MCP-ROUTER] First segment:', firstSegment);
    
    // Check if first segment is a valid language code
    const isValidLanguage = languageCodes.includes(firstSegment);
    console.log('[MCP-ROUTER] Is valid language?', isValidLanguage);
    console.log('[MCP-ROUTER] Supported languages:', languageCodes);
    
    if (isValidLanguage) {
      console.log('[MCP-ROUTER] Valid language found:', firstSegment);
      return {
        language: firstSegment,
        shouldRedirect: false,
        redirectPath: null
      };
    }
    
    // Only redirect from exact root path
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

    // For any other path, use default language without redirect
    const defaultLang = 'de';
    console.log('[MCP-ROUTER] Using default language for path:', location.pathname);
    return {
      language: defaultLang,
      shouldRedirect: false,
      redirectPath: null
    };
  }, [location.pathname]);

  console.log('[MCP-ROUTER] Final language:', language);
  console.log('[MCP-ROUTER] Should redirect:', shouldRedirect);
  console.log('[MCP-ROUTER] Redirect path:', redirectPath);

  // Handle redirect only from root
  if (shouldRedirect && redirectPath) {
    console.log('[MCP-ROUTER] Performing redirect to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  console.log('[MCP-ROUTER] Rendering with LanguageMCP, language:', language);

  // Simplified routing structure with LanguageMCP
  return (
    <LanguageMCP initialLanguage={language}>
      <Routes>
        {/* Debug route */}
        <Route path="/debug" element={
          <div style={{ padding: '20px' }}>
            <h1>Debug Info</h1>
            <p>Current Language: {language}</p>
            <p>Current Path: {location.pathname}</p>
            <p>Path Segments: {JSON.stringify(location.pathname.split('/').filter(Boolean))}</p>
          </div>
        } />
        
        {/* Root redirect */}
        <Route path="/" element={<Navigate to={`/${language}`} replace />} />
        
        {/* Language-prefixed routes */}
        <Route path="/de" element={<Landing />} />
        <Route path="/en" element={<Landing />} />
        <Route path="/ar" element={<Landing />} />
        
        <Route path="/de/pre-register" element={<PreRegister />} />
        <Route path="/en/pre-register" element={<PreRegister />} />
        <Route path="/ar/pre-register" element={<PreRegister />} />
        
        {/* Catch all */}
        <Route path="*" element={
          <div style={{ padding: '20px' }}>
            <h1>404 - Route not found</h1>
            <p>Current path: {location.pathname}</p>
            <p>Available routes:</p>
            <ul>
              <li>/de</li>
              <li>/en</li>
              <li>/ar</li>
              <li>/de/pre-register</li>
              <li>/en/pre-register</li>
              <li>/ar/pre-register</li>
              <li>/debug</li>
            </ul>
          </div>
        } />
      </Routes>
    </LanguageMCP>
  );
};

export default MCPRouter;
