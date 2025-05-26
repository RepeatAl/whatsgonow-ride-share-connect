
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageMCP } from '@/mcp/language/LanguageMCP';
import { SimpleAuthProvider } from '@/contexts/SimpleAuthContext';
import MCPRouter from '@/components/routing/MCPRouter';

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <LanguageMCP initialLanguage="de">
          <SimpleAuthProvider>
            <MCPRouter />
            <Toaster />
          </SimpleAuthProvider>
        </LanguageMCP>
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
