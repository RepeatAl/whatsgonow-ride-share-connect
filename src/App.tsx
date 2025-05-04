
import React, { Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import { AppRoutes } from './components/routing/AppRoutes';
import { ChatRealtimeProvider } from './features/chat/context/ChatRealtimeContext';

function App() {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <ChatRealtimeProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <AppRoutes />
            </Suspense>
          </ChatRealtimeProvider>
        </AuthProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}

export default App;
