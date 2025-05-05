
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './components/routing/AppRoutes';
import { Toaster } from './components/ui/toaster';
import CookieConsent from './components/CookieConsent';
import { NotificationProvider } from './contexts/NotificationContext';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <NotificationProvider>
          <AppRoutes />
          <Toaster />
          <CookieConsent />
        </NotificationProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
