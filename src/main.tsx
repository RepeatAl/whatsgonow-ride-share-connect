
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import LaunchProvider from './components/launch/LaunchProvider'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <LaunchProvider>
      <App />
    </LaunchProvider>
  </BrowserRouter>
);
