
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

// Force set the initial document direction
document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
document.body.dir = isRTL ? 'rtl' : 'ltr';

// Log initial language state in development mode
console.log('[INIT] Initial language:', initialLanguage);
console.log('[INIT] Is RTL language:', isRTL);
console.log('[INIT] Initial document.dir:', document.documentElement.dir);

// Show loading indicator while loading required namespaces
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

// Check if we're coming from a language switch
const langSwitchTimestamp = sessionStorage.getItem('langSwitchTimestamp');
const targetLanguage = sessionStorage.getItem('targetLanguage');

// Make sure all required namespaces are loaded before rendering
const requiredNamespaces = ['common', 'landing', 'pre_register', 'faq'];

// Function to render the app once resources are loaded
const renderApp = () => {
  try {
    console.log("🚀 App initialization started");
    console.log("[INIT-CHECK] Document dir before mount:", document.documentElement.dir);
    console.log("[INIT-CHECK] i18n language before mount:", i18n.language);
    console.log("[INIT-CHECK] localStorage i18nextLng before mount:", localStorage.getItem('i18nextLng'));
    
    // Log loaded namespaces for debugging
    requiredNamespaces.forEach(ns => {
      console.log(`[INIT-CHECK] Namespace '${ns}' loaded for '${i18n.language}':`, 
        i18n.hasResourceBundle(i18n.language, ns));
    });
    
    createRoot(rootElement).render(
      <App />
    );
    
    console.log("✅ App successfully mounted");
  } catch (error) {
    console.error("❌ Failed to initialize app:", error);
    
    // Show error message if initialization fails
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
};

// If this is a language switch, ensure we use the target language
if (langSwitchTimestamp && targetLanguage) {
  const timestamp = parseInt(langSwitchTimestamp);
  const now = Date.now();
  const timeDiff = now - timestamp;
  
  // If this is a recent language switch (within last 10 seconds)
  if (timeDiff < 10000) {
    console.log('[INIT] Detected recent language switch to:', targetLanguage);
    // Force set the language
    i18n.changeLanguage(targetLanguage).then(() => {
      // Load all required namespaces for the target language
      i18n.loadNamespaces(requiredNamespaces).then(() => {
        console.log('[INIT-SWITCH] Namespaces loaded after language switch');
        // Clear the timestamp and render
        sessionStorage.removeItem('langSwitchTimestamp');
        sessionStorage.removeItem('targetLanguage');
        renderApp();
      });
    });
  } else {
    // Clear old timestamps
    sessionStorage.removeItem('langSwitchTimestamp');
    sessionStorage.removeItem('targetLanguage');
    // Load namespaces and render
    i18n.loadNamespaces(requiredNamespaces).then(renderApp);
  }
} else {
  // Normal startup - just load namespaces and render
  i18n.loadNamespaces(requiredNamespaces).then(renderApp);
}

// Listen for language changes to update the document direction
i18n.on('languageChanged', (lng) => {
  const isRTL = lng === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.body.dir = isRTL ? 'rtl' : 'ltr';
  localStorage.setItem('i18nextLng', lng);
  
  console.log('[LANG-CHANGE-EVENT] Language changed to:', lng);
  console.log('[LANG-CHANGE-EVENT] Document direction set to:', document.documentElement.dir);
  console.log('[LANG-CHANGE-EVENT] Is RTL:', isRTL);
  console.log('[LANG-CHANGE-EVENT] localStorage i18nextLng:', localStorage.getItem('i18nextLng'));
  console.log('[LANG-CHANGE-EVENT] Landing namespace loaded:', i18n.hasResourceBundle(lng, 'landing'));
});
