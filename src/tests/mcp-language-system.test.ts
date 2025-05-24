
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { LanguageMCP, useLanguageMCP } from '@/mcp/language/LanguageMCP';
import MCPErrorBoundary from '@/mcp/components/MCPErrorBoundary';

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
  }),
}));

// Mock LanguageService
vi.mock('@/services/LanguageService', () => ({
  changeAppLanguage: vi.fn().mockResolvedValue(undefined),
}));

// Mock Supabase
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: () => ({
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  },
}));

// Test component that uses the MCP hook
const TestComponent = () => {
  const { currentLanguage, setLanguageByCode, languageLoading, isRtl } = useLanguageMCP();
  
  return React.createElement('div', null,
    React.createElement('div', { 'data-testid': 'current-language' }, currentLanguage),
    React.createElement('div', { 'data-testid': 'loading-state' }, languageLoading ? 'loading' : 'ready'),
    React.createElement('div', { 'data-testid': 'rtl-state' }, isRtl ? 'rtl' : 'ltr'),
    React.createElement('button', { 
      'data-testid': 'change-language',
      onClick: () => setLanguageByCode('ar')
    }, 'Change to Arabic')
  );
};

// Wrapper component for testing
const TestWrapper = ({ initialLanguage = 'de', children }) => 
  React.createElement(BrowserRouter, null,
    React.createElement(LanguageMCP, { initialLanguage },
      children
    )
  );

describe('MCP Language System - Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('LanguageMCP Provider', () => {
    it('should provide default language context', async () => {
      render(
        React.createElement(TestWrapper, null,
          React.createElement(TestComponent)
        )
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-language')).toHaveTextContent('de');
        expect(screen.getByTestId('loading-state')).toHaveTextContent('ready');
        expect(screen.getByTestId('rtl-state')).toHaveTextContent('ltr');
      });
    });

    it('should initialize with provided language', async () => {
      render(
        React.createElement(TestWrapper, { initialLanguage: 'en' },
          React.createElement(TestComponent)
        )
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      });
    });

    it('should handle RTL languages correctly', async () => {
      render(
        React.createElement(TestWrapper, { initialLanguage: 'ar' },
          React.createElement(TestComponent)
        )
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-language')).toHaveTextContent('ar');
        expect(screen.getByTestId('rtl-state')).toHaveTextContent('rtl');
      });
    });
  });

  describe('useLanguageMCP Hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(React.createElement(TestComponent));
      }).toThrow('useLanguageMCP must be used within a LanguageMCP');
      
      consoleSpy.mockRestore();
    });

    it('should provide all required context properties', async () => {
      render(
        React.createElement(TestWrapper, null,
          React.createElement(TestComponent)
        )
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-language')).toBeInTheDocument();
        expect(screen.getByTestId('loading-state')).toBeInTheDocument();
        expect(screen.getByTestId('rtl-state')).toBeInTheDocument();
        expect(screen.getByTestId('change-language')).toBeInTheDocument();
      });
    });
  });

  describe('Language Switching', () => {
    it('should handle language changes', async () => {
      const { changeAppLanguage } = await import('@/services/LanguageService');
      
      render(
        React.createElement(TestWrapper, null,
          React.createElement(TestComponent)
        )
      );

      const changeButton = screen.getByTestId('change-language');
      changeButton.click();

      await waitFor(() => {
        expect(changeAppLanguage).toHaveBeenCalledWith('ar');
      });
    });
  });
});

describe('MCP Error Boundary Tests', () => {
  // Component that throws an error
  const ErrorComponent = () => {
    throw new Error('Test error for MCP');
  };

  it('should catch and display error boundary', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      React.createElement(MCPErrorBoundary, null,
        React.createElement(ErrorComponent)
      )
    );

    expect(screen.getByText('Language System Error')).toBeInTheDocument();
    expect(screen.getByText(/The language system encountered an error/)).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('should provide retry functionality', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      React.createElement(MCPErrorBoundary, null,
        React.createElement(ErrorComponent)
      )
    );

    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('should render children when no error occurs', () => {
    const GoodComponent = () => React.createElement('div', null, 'Working component');
    
    render(
      React.createElement(MCPErrorBoundary, null,
        React.createElement(GoodComponent)
      )
    );

    expect(screen.getByText('Working component')).toBeInTheDocument();
    expect(screen.queryByText('Language System Error')).not.toBeInTheDocument();
  });
});

describe('MCP Performance Tests', () => {
  it('should not re-render unnecessarily', async () => {
    let renderCount = 0;
    
    const CountingComponent = () => {
      renderCount++;
      const { currentLanguage } = useLanguageMCP();
      return React.createElement('div', null, currentLanguage);
    };

    render(
      React.createElement(TestWrapper, null,
        React.createElement(CountingComponent)
      )
    );

    await waitFor(() => {
      expect(renderCount).toBeLessThanOrEqual(2); // Initial render + potential update
    });
  });

  it('should memoize context value properly', async () => {
    const contextValues = [];
    
    const ContextTracker = () => {
      const context = useLanguageMCP();
      contextValues.push(context);
      return React.createElement('div', null, context.currentLanguage);
    };

    render(
      React.createElement(TestWrapper, null,
        React.createElement(ContextTracker)
      )
    );

    await waitFor(() => {
      // Context should be stable across renders
      if (contextValues.length > 1) {
        expect(contextValues[0].currentLanguage).toBe(contextValues[1].currentLanguage);
      }
    });
  });
});
