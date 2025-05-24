
import React from 'react';
import { LanguageMCP } from '../language/LanguageMCP';
import { ChatLanguageMCP } from '../chat/ChatLanguageMCP';
import { VehicleSelectionMCP } from '../vehicle/VehicleSelectionMCP';
import { ItemGroupingMCP } from '../items/ItemGroupingMCP';

interface MCPOrchestratorProps {
  children: React.ReactNode;
  initialLanguage: string;
  enabledMCPs?: string[];
}

/**
 * MCP Orchestrator - Phase 1 Implementation
 * Provides clean composition of domain-specific MCPs
 * Focus: Stability and Single Source of Truth for each domain
 */
export const MCPOrchestrator: React.FC<MCPOrchestratorProps> = ({ 
  children, 
  initialLanguage,
  enabledMCPs = ['language', 'chat', 'vehicle', 'items']
}) => {
  let content = children;

  // Wrap with enabled MCPs in reverse order for proper nesting
  // Each MCP is responsible for its own domain only
  if (enabledMCPs.includes('items')) {
    content = <ItemGroupingMCP>{content}</ItemGroupingMCP>;
  }
  
  if (enabledMCPs.includes('vehicle')) {
    content = <VehicleSelectionMCP>{content}</VehicleSelectionMCP>;
  }
  
  if (enabledMCPs.includes('chat')) {
    content = <ChatLanguageMCP>{content}</ChatLanguageMCP>;
  }
  
  // Language MCP is the foundation - always at the top level
  if (enabledMCPs.includes('language')) {
    content = <LanguageMCP initialLanguage={initialLanguage}>{content}</LanguageMCP>;
  }

  return <>{content}</>;
};
