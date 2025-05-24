
import React from 'react';
import { LanguageMCP } from '../language/LanguageMCP';
import MCPErrorBoundary from '../components/MCPErrorBoundary';

interface MCPOrchestratorProps {
  children: React.ReactNode;
  initialLanguage: string;
  enabledMCPs?: string[];
}

/**
 * Enhanced MCP Orchestrator - Phase 1 Implementation with Error Handling
 * Only LanguageMCP enabled to prevent provider conflicts
 * Other MCPs temporarily disabled until stabilization complete
 */
export const MCPOrchestrator: React.FC<MCPOrchestratorProps> = ({ 
  children, 
  initialLanguage,
  enabledMCPs = ['language'] // Only language MCP for now
}) => {
  console.log('[MCP-ORCHESTRATOR] Enabled MCPs:', enabledMCPs);
  console.log('[MCP-ORCHESTRATOR] Initial language:', initialLanguage);

  let content = children;

  // Only wrap with LanguageMCP for now - other MCPs commented out
  if (enabledMCPs.includes('language')) {
    console.log('[MCP-ORCHESTRATOR] Wrapping with LanguageMCP');
    content = (
      <MCPErrorBoundary onError={(error) => {
        console.error('[MCP-ORCHESTRATOR] LanguageMCP Error:', error);
      }}>
        <LanguageMCP initialLanguage={initialLanguage}>{content}</LanguageMCP>
      </MCPErrorBoundary>
    );
  }

  // Temporarily disabled MCPs to prevent conflicts:
  // - ChatLanguageMCP: Not yet implemented
  // - VehicleSelectionMCP: Not yet implemented  
  // - ItemGroupingMCP: Not yet implemented

  return <>{content}</>;
};
