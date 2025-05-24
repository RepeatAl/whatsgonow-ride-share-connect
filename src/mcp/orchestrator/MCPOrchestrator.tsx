
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
 * MCP Orchestrator - Combines multiple domain-specific MCPs
 * Provides a clean way to compose different MCPs based on application needs
 */
export const MCPOrchestrator: React.FC<MCPOrchestratorProps> = ({ 
  children, 
  initialLanguage,
  enabledMCPs = ['language', 'chat', 'vehicle', 'items']
}) => {
  let content = children;

  // Wrap with enabled MCPs in reverse order for proper nesting
  if (enabledMCPs.includes('items')) {
    content = <ItemGroupingMCP>{content}</ItemGroupingMCP>;
  }
  
  if (enabledMCPs.includes('vehicle')) {
    content = <VehicleSelectionMCP>{content}</VehicleSelectionMCP>;
  }
  
  if (enabledMCPs.includes('chat')) {
    content = <ChatLanguageMCP>{content}</ChatLanguageMCP>;
  }
  
  if (enabledMCPs.includes('language')) {
    content = <LanguageMCP initialLanguage={initialLanguage}>{content}</LanguageMCP>;
  }

  return <>{content}</>;
};
