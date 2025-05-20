
import { ThemeProvider } from './contexts/ThemeContext';
import { AppRoutes } from './components/routing/AppRoutes';
import { Toaster } from './components/ui/toaster';
import CookieConsent from './components/CookieConsent';
import { NotificationProvider } from './contexts/NotificationContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserSessionProvider } from './contexts/UserSessionContext';
import { AppBootstrap } from './components/AppBootstrap';
import LaunchProvider from './components/launch/LaunchProvider';
import { TooltipProvider } from './components/ui/tooltip';
import { ErrorBoundary } from './components/ui/error-boundary';
import { RTLDebugBanner } from './components/RTLDebugBanner';
import { RTLDebugIndicator } from './components/RTLDebugIndicator';
import RTLDebugPanel from './components/RTLDebugPanel';

import './App.css';

// Provider-Hierarchie:
// <Router> → <ThemeProvider> → <UserSessionProvider> → <AppBootstrap> → <LaunchProvider> → <AuthProvider> → <NotificationProvider> → <AppRoutes>

function App() {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <>
      <RTLDebugIndicator />
      <Router>
        <ThemeProvider>
          <UserSessionProvider>
            <AppBootstrap>
              <LaunchProvider>
                <AuthProvider>
                  <NotificationProvider>
                    <TooltipProvider>
                      <ErrorBoundary>
                        <RTLDebugBanner />
                        <AppRoutes />
                      </ErrorBoundary>
                      <Toaster />
                      <CookieConsent />
                      {isDev && <RTLDebugPanel />}
                    </TooltipProvider>
                  </NotificationProvider>
                </AuthProvider>
              </LaunchProvider>
            </AppBootstrap>
          </UserSessionProvider>
        </ThemeProvider>
      </Router>
    </>
  );
}

export default App;
