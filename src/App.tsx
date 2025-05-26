
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageMCP } from '@/mcp/language/LanguageMCP';
import { SimpleAuthProvider } from '@/contexts/SimpleAuthContext';
import MCPRouter from '@/components/routing/MCPRouter';
import MCPErrorBoundary from '@/mcp/components/MCPErrorBoundary';

function App() {
  return (
    <MCPErrorBoundary>
      <BrowserRouter>
        <TooltipProvider>
          <ThemeProvider>
            <LanguageMCP initialLanguage="de">
              <SimpleAuthProvider>
                <MCPRouter />
                <Toaster />
              </SimpleAuthProvider>
            </LanguageMCP>
          </ThemeProvider>
        </TooltipProvider>
      </BrowserRouter>
    </MCPErrorBoundary>
  );
}

export default App;
