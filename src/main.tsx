
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import LaunchProvider from './components/launch/LaunchProvider'

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <LaunchProvider>
          <App />
        </LaunchProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
