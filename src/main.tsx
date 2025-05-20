
import './i18n/i18n'; // Must be imported first for i18n configuration to be loaded
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import i18n from './i18n/i18n';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Get the initial language from localStorage to ensure it's set correctly before rendering
const initialLanguage = localStorage.getItem('i18nextLng') || i18n.language || 'de';
const isRTL = initialLanguage === 'ar';

// Set the initial document direction
document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

// Log initial language state in development mode
console.log('[INIT] Initial language:', initialLanguage);
console.log('[INIT] Is RTL language:', isRTL);
console.log('[INIT] Initial document.dir:', document.documentElement.dir);

// Listen for language changes to update the document direction
i18n.on('languageChanged', (lng) => {
  const isRTL = lng === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  
  console.log('[LANG-CHANGE-EVENT] Language changed to:', lng);
  console.log('[LANG-CHANGE-EVENT] Document direction set to:', document.documentElement.dir);
  console.log('[LANG-CHANGE-EVENT] Is RTL:', isRTL);
});

// Starte mit einer einfachen Ladeanimation, bis die App initialisiert ist
rootElement.innerHTML = `
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
    <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #ff6b00; border-radius: 50%; animation: spin 1s linear infinite;"></div>
    <p style="margin-top: 20px;">Whatsgonow wird geladen...</p>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>
`;

// Initialisiere die App erst, wenn das DOM vollständig geladen ist
window.addEventListener('DOMContentLoaded', () => {
  try {
    console.log("🚀 App initialization started");
    
    createRoot(rootElement).render(
      <App />
    );
    
    console.log("✅ App successfully mounted");
  } catch (error) {
    console.error("❌ Failed to initialize app:", error);
    
    // Zeige Fehlermeldung, wenn die Initialisierung fehlschlägt
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; color: #e11d48; max-width: 500px; margin: 0 auto; text-align: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h2 style="margin-top: 20px; font-size: 24px;">Ein Fehler ist aufgetreten</h2>
        <p style="margin-top: 10px;">Die Anwendung konnte nicht initialisiert werden. Bitte versuche es später erneut oder kontaktiere den Support.</p>
        <button 
          style="margin-top: 20px; background-color: #ff6b00; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;"
          onclick="window.location.reload()"
        >
          Seite neu laden
        </button>
      </div>
    `;
  }
});
