
import { ThemeProvider } from './contexts/ThemeContext';
import { AppRoutes } from './components/routing/AppRoutes';
import { Toaster } from './components/ui/toaster';
import CookieConsent from './components/CookieConsent';
import { NotificationProvider } from './contexts/NotificationContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LaunchProvider from './components/launch/LaunchProvider';

import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LaunchProvider>
          <AuthProvider>
            <NotificationProvider>
              <AppRoutes />
              <Toaster />
              <CookieConsent />
            </NotificationProvider>
          </AuthProvider>
        </LaunchProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
