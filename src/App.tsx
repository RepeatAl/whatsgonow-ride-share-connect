
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

import './App.css';

// Provider-Hierarchie:
// <Router> → <ThemeProvider> → <UserSessionProvider> → <AppBootstrap> → <LaunchProvider> → <AuthProvider> → <NotificationProvider> → <AppRoutes>

function App() {
  return (
    <Router>
      <ThemeProvider>
        <UserSessionProvider>
          <AppBootstrap>
            <LaunchProvider>
              <AuthProvider>
                <NotificationProvider>
                  <AppRoutes />
                  <Toaster />
                  <CookieConsent />
                </NotificationProvider>
              </AuthProvider>
            </LaunchProvider>
          </AppBootstrap>
        </UserSessionProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
