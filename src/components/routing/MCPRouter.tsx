
import React, { useMemo } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { languageCodes } from '@/config/supportedLanguages';
import { determineBestLanguage } from '@/utils/languageUtils';
import { MCPOrchestrator } from '@/mcp';
import AppRoutes from './AppRoutes';

/**
 * Master Control Point (MCP) Router
 * Simplified entry point that orchestrates all domain-specific MCPs
 * Phase 1: Focus on critical routing stability
 */
export const MCPRouter: React.FC = () => {
  const location = useLocation();

  // Simple language extraction without complex redirects
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
    
    // Only redirect if we're truly on root - avoid 404 loops
    if (location.pathname === '/' || location.pathname === '') {
      const bestLanguage = determineBestLanguage(
        navigator.language?.split('-')[0],
        localStorage.getItem('i18nextLng')
      );
      
      return {
        language: bestLanguage,
        needsRedirect: true,
        redirectPath: `/${bestLanguage}`
      };
    }

    // For 404 or unknown paths, use default language without redirect
    const defaultLang = 'de';
    return {
      language: defaultLang,
      needsRedirect: false,
      redirectPath: null
    };
  }, [location.pathname]);

  // Only redirect from exact root path
  if (needsRedirect && redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render app with MCP orchestration
  return (
    <MCPOrchestrator initialLanguage={language}>
      <AppRoutes />
    </MCPOrchestrator>
  );
};

export default MCPRouter;
