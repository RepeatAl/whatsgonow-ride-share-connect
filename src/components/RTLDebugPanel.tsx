
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const RTLDebugPanel = () => {
  const { i18n } = useTranslation();
  const [htmlDir, setHtmlDir] = useState(document.documentElement.dir);
  const [bodyDir, setBodyDir] = useState(document.body.dir);
  const [storedLang, setStoredLang] = useState(localStorage.getItem('i18nextLng'));
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [isRtl, setIsRtl] = useState(i18n.language === 'ar');
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const updateState = () => {
      setHtmlDir(document.documentElement.dir);
      setBodyDir(document.body.dir);
      setStoredLang(localStorage.getItem('i18nextLng'));
      setCurrentLang(i18n.language);
      setIsRtl(i18n.language === 'ar');
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
  }, [i18n]);

  if (!isDev) return null;
  
  const hasInconsistencies = 
    (isRtl && htmlDir !== 'rtl') || 
    (!isRtl && htmlDir === 'rtl') ||
    (storedLang !== currentLang) ||
    (htmlDir !== bodyDir);
  
  const fixRTLDirection = () => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.body.dir = isRtl ? 'rtl' : 'ltr';
    localStorage.setItem('i18nextLng', currentLang);
    updateState();
    console.log('[RTL-FIX] Applied RTL fixes:', {
      htmlDir: document.documentElement.dir,
      bodyDir: document.body.dir,
      storedLang: localStorage.getItem('i18nextLng')
    });
  };
  
  const updateState = () => {
    setHtmlDir(document.documentElement.dir);
    setBodyDir(document.body.dir);
    setStoredLang(localStorage.getItem('i18nextLng'));
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-2 text-xs z-50 ${hasInconsistencies ? 'bg-red-500' : 'bg-green-500'} text-white`}>
      <div className="flex justify-between items-center">
        <div className="text-left">
          <div>i18n: {currentLang} {isRtl ? '(RTL)' : '(LTR)'}</div>
          <div>HTML dir: {htmlDir}</div>
          <div>Body dir: {bodyDir}</div>
          <div>localStorage: {storedLang || 'not set'}</div>
        </div>
        {hasInconsistencies && (
          <button 
            onClick={fixRTLDirection}
            className="bg-yellow-500 text-black px-2 py-1 rounded"
          >
            Fix RTL Issues
          </button>
        )}
      </div>
    </div>
  );
};

export default RTLDebugPanel;
