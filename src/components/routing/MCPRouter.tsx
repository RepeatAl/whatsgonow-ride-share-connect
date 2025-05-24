
import React, { useMemo } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { languageCodes } from '@/config/supportedLanguages';
import { determineBestLanguage } from '@/utils/languageUtils';
import { MCPOrchestrator } from '@/mcp';
import AppRoutes from './AppRoutes';

/**
 * Master Control Point (MCP) Router
 * Entry point that orchestrates all domain-specific MCPs
 * and handles initial routing decisions
 */
export const MCPRouter: React.FC = () => {
  const location = useLocation();

  // Extract language and determine if redirect is needed
  const { language, needsRedirect, redirectPath } = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    // Check if first segment is a valid language code
    const isValidLanguage = languageCodes.includes(firstSegment);
    
    if (isValidLanguage) {
      return {
        language: firstSegment,
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
      needsRedirect: true,
      redirectPath: `/${bestLanguage}${location.pathname === '/' ? '' : location.pathname}`
    };
  }, [location.pathname]);

  // Handle redirects for missing language prefix
  if (needsRedirect && redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render app with modular MCP structure
  return (
    <MCPOrchestrator initialLanguage={language}>
      <AppRoutes />
    </MCPOrchestrator>
  );
};

export default MCPRouter;
