import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageMCP } from '@/mcp/language/LanguageMCP';
import { SimpleAuthProvider } from '@/contexts/SimpleAuthContext';
import MCPRouter from '@/components/routing/MCPRouter';
import MCPErrorBoundary from '@/mcp/components/MCPErrorBoundary';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { AdminRoute } from '@/components/routing/AdminRoute';
import DashboardAdminEnhanced from '@/components/dashboard/DashboardAdminEnhanced';

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
                <Route path="/admin-enhanced" element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <DashboardAdminEnhanced />
                    </AdminRoute>
                  </ProtectedRoute>
                } />
              </SimpleAuthProvider>
            </LanguageMCP>
          </ThemeProvider>
        </TooltipProvider>
      </BrowserRouter>
    </MCPErrorBoundary>
  );
}

export default App;
