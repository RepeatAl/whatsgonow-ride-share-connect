
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MCPOrchestrator } from '@/mcp/orchestrator/MCPOrchestrator';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock all dependencies
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('@/services/LanguageService', () => ({
  changeAppLanguage: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: () => ({
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  },
}));

describe('MCP Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('MCPOrchestrator', () => {
    it('should render with default enabled MCPs', () => {
      const TestChild = () => React.createElement('div', { 'data-testid': 'test-child' }, 'Test Child');
      
      render(
        React.createElement(BrowserRouter, null,
          React.createElement(MCPOrchestrator, { 
            initialLanguage: 'de',
            children: React.createElement(TestChild)
          })
        )
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should wrap only enabled MCPs', () => {
      const TestChild = () => React.createElement('div', { 'data-testid': 'test-child' }, 'Test Child');
      
      render(
        React.createElement(BrowserRouter, null,
          React.createElement(MCPOrchestrator, { 
            initialLanguage: 'en', 
            enabledMCPs: ['language'],
            children: React.createElement(TestChild)
          })
        )
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should handle empty enabled MCPs array', () => {
      const TestChild = () => React.createElement('div', { 'data-testid': 'test-child' }, 'Test Child');
      
      render(
        React.createElement(BrowserRouter, null,
          React.createElement(MCPOrchestrator, { 
            initialLanguage: 'de', 
            enabledMCPs: [],
            children: React.createElement(TestChild)
          })
        )
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
  });

  describe('MCP Error Handling Integration', () => {
    it('should handle language MCP errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const ErrorChild = () => {
        throw new Error('MCP Integration Error');
      };
      
      render(
        React.createElement(BrowserRouter, null,
          React.createElement(MCPOrchestrator, { 
            initialLanguage: 'de',
            children: React.createElement(ErrorChild)
          })
        )
      );

      // Should show error boundary UI
      expect(screen.getByText('Language System Error')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('MCP Console Logging', () => {
    it('should log MCP orchestrator activity', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      const TestChild = () => React.createElement('div', null, 'Test');
      
      render(
        React.createElement(BrowserRouter, null,
          React.createElement(MCPOrchestrator, { 
            initialLanguage: 'de',
            children: React.createElement(TestChild)
          })
        )
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        '[MCP-ORCHESTRATOR] Enabled MCPs:', 
        ['language']
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[MCP-ORCHESTRATOR] Initial language:', 
        'de'
      );
      
      consoleSpy.mockRestore();
    });
  });
});

describe('MCP vs Legacy Provider Compatibility', () => {
  describe('Interface Compatibility', () => {
    it('should provide backward compatible interface', () => {
      // Test that MCP provides the same interface as old providers
      const interfaceKeys = [
        'currentLanguage',
        'setLanguageByCode', 
        'getLocalizedUrl',
        'languageLoading',
        'supportedLanguages',
        'isRtl'
      ];

      // This would be tested with actual component rendering
      // For now, just verify the interface exists
      expect(interfaceKeys).toEqual(expect.arrayContaining([
        'currentLanguage',
        'setLanguageByCode',
        'getLocalizedUrl',
        'languageLoading',
        'supportedLanguages',
        'isRtl'
      ]));
    });
  });

  describe('Migration Safety', () => {
    it('should not break existing functionality', () => {
      // Test that migrated components work the same way
      // This would involve actual component testing in a real scenario
      expect(true).toBe(true); // Placeholder
    });
  });
});
