
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import LaunchProvider from './components/launch/LaunchProvider'

// Create root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <BrowserRouter>
    <LaunchProvider>
      <App />
    </LaunchProvider>
  </BrowserRouter>
);
