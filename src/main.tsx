
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import LaunchProvider from './components/launch/LaunchProvider'
import { ThemeProvider } from './contexts/ThemeContext'

// Create root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <BrowserRouter>
    <ThemeProvider>
      <LaunchProvider>
        <App />
      </LaunchProvider>
    </ThemeProvider>
  </BrowserRouter>
);
