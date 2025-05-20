
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const RTLDebugPanel = () => {
  const { i18n } = useTranslation();
  const [htmlDir, setHtmlDir] = useState(document.documentElement.dir);
  const [bodyDir, setBodyDir] = useState(document.body.dir);
  const [storedLang, setStoredLang] = useState(localStorage.getItem('i18nextLng'));
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [isRtl, setIsRtl] = useState(i18n.language === 'ar');
  const [loadedNamespaces, setLoadedNamespaces] = useState<string[]>([]);
  const isDev = process.env.NODE_ENV === 'development';
  
  // Track loaded namespaces
  const requiredNamespaces = ['common', 'landing', 'pre_register', 'errors', 'faq'];

  useEffect(() => {
    const updateState = () => {
      setHtmlDir(document.documentElement.dir);
      setBodyDir(document.body.dir);
      setStoredLang(localStorage.getItem('i18nextLng'));
      setCurrentLang(i18n.language);
      setIsRtl(i18n.language === 'ar');
      
      // Check which namespaces are loaded
      const loadedNs = requiredNamespaces.filter(ns => 
        i18n.hasResourceBundle(i18n.language, ns)
      );
      setLoadedNamespaces(loadedNs);
    };

    updateState();

    const onLangChange = () => {
      updateState();
    };

    i18n.on('languageChanged', onLangChange);

    // Check periodically to catch any external changes
    const intervalId = setInterval(updateState, 1000);

    return () => {
      i18n.off('languageChanged', onLangChange);
      clearInterval(intervalId);
    };
  }, [i18n, requiredNamespaces]);

  if (!isDev) return null;
  
  const hasInconsistencies = 
    (isRtl && htmlDir !== 'rtl') || 
    (!isRtl && htmlDir === 'rtl') ||
    (storedLang !== currentLang) ||
    (htmlDir !== bodyDir) ||
    (loadedNamespaces.length < requiredNamespaces.length);
  
  const fixRTLDirection = () => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.body.dir = isRtl ? 'rtl' : 'ltr';
    localStorage.setItem('i18nextLng', currentLang);
    
    // Try to load missing namespaces
    requiredNamespaces.forEach(ns => {
      if (!i18n.hasResourceBundle(currentLang, ns)) {
        i18n.loadNamespaces(ns);
      }
    });
    
    updateState();
    console.log('[RTL-FIX] Applied RTL fixes:', {
      htmlDir: document.documentElement.dir,
      bodyDir: document.body.dir,
      storedLang: localStorage.getItem('i18nextLng'),
      loadedNamespaces: requiredNamespaces.filter(ns => 
        i18n.hasResourceBundle(i18n.language, ns)
      )
    });
  };
  
  const updateState = () => {
    setHtmlDir(document.documentElement.dir);
    setBodyDir(document.body.dir);
    setStoredLang(localStorage.getItem('i18nextLng'));
    setCurrentLang(i18n.language);
    setIsRtl(i18n.language === 'ar');
    
    // Update loaded namespaces
    const loadedNs = requiredNamespaces.filter(ns => 
      i18n.hasResourceBundle(i18n.language, ns)
    );
    setLoadedNamespaces(loadedNs);
  };

  // Force reload the page
  const forceReload = () => {
    console.log('[RTL-DEBUG] Force reloading page');
    window.location.reload();
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-2 text-xs z-50 ${hasInconsistencies ? 'bg-red-500' : 'bg-green-500'} text-white`}>
      <div className="flex justify-between items-center">
        <div className="text-left">
          <div>i18n: {currentLang} {isRtl ? '(RTL)' : '(LTR)'}</div>
          <div>HTML dir: {htmlDir}</div>
          <div>Body dir: {bodyDir}</div>
          <div>localStorage: {storedLang || 'not set'}</div>
          <div>
            Namespaces: {loadedNamespaces.join(', ')} 
            {loadedNamespaces.length < requiredNamespaces.length && 
              <span className="text-yellow-300 ml-1">
                (Missing: {requiredNamespaces.filter(ns => !loadedNamespaces.includes(ns)).join(', ')})
              </span>
            }
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {hasInconsistencies && (
            <button 
              onClick={fixRTLDirection}
              className="bg-yellow-500 text-black px-2 py-1 rounded"
            >
              Fix RTL Issues
            </button>
          )}
          <button 
            onClick={forceReload}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Force Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default RTLDebugPanel;
