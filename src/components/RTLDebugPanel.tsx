import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const RTLDebugPanel = () => {
  const { i18n } = useTranslation();
  const isDev = useMemo(() => process.env.NODE_ENV === 'development', []);
  const requiredNamespaces = ['common', 'landing', 'pre_register', 'errors', 'faq'];

  const getCurrentState = () => ({
    htmlDir: document.documentElement.dir,
    bodyDir: document.body.dir,
    storedLang: localStorage.getItem('i18nextLng'),
    currentLang: i18n.language,
    isRtl: i18n.language === 'ar',
    loadedNamespaces: requiredNamespaces.filter(ns => i18n.hasResourceBundle(i18n.language, ns)),
  });

  const [state, setState] = useState(getCurrentState());

  useEffect(() => {
    if (!isDev) return;

    const updateState = () => {
      const nextState = getCurrentState();
      setState(prev => {
        const isChanged = JSON.stringify(prev) !== JSON.stringify(nextState);
        return isChanged ? nextState : prev;
      });
    };

    updateState();
    const intervalId = setInterval(updateState, 5000); // ⬅️ Reduziert auf 5s

    i18n.on('languageChanged', updateState);

    return () => {
      clearInterval(intervalId);
      i18n.off('languageChanged', updateState);
    };
  }, [i18n, isDev]);

  if (!isDev) return null;

  const {
    htmlDir, bodyDir, storedLang, currentLang, isRtl, loadedNamespaces
  } = state;

  const missingNamespaces = requiredNamespaces.filter(ns => !loadedNamespaces.includes(ns));
  const hasInconsistencies =
    (isRtl && htmlDir !== 'rtl') ||
    (!isRtl && htmlDir === 'rtl') ||
    (storedLang !== currentLang) ||
    (htmlDir !== bodyDir) ||
    (missingNamespaces.length > 0);

  const fixRTLDirection = () => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.body.dir = isRtl ? 'rtl' : 'ltr';
    localStorage.setItem('i18nextLng', currentLang);
    missingNamespaces.forEach(ns => i18n.loadNamespaces(ns));
    setState(getCurrentState());
    console.log('[RTL-FIX] Applied fixes.');
  };

  const forceReload = () => {
    console.log('[RTL-DEBUG] Force reloading page');
    window.location.reload();
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-2 text-xs z-50 ${hasInconsistencies ? 'bg-red-500' : 'bg-green-500'} text-white`}>
      <div className="flex justify-between items-center">
        <div className="text-left space-y-1">
          <div>i18n: {currentLang} {isRtl ? '(RTL)' : '(LTR)'}</div>
          <div>HTML dir: {htmlDir}</div>
          <div>Body dir: {bodyDir}</div>
          <div>localStorage: {storedLang || 'not set'}</div>
          <div>
            Namespaces: {loadedNamespaces.join(', ')}
            {missingNamespaces.length > 0 && (
              <span className="text-yellow-300 ml-1">
                (Missing: {missingNamespaces.join(', ')})
              </span>
            )}
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
