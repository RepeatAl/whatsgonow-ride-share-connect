
import { useTranslation } from "react-i18next";

export const RTLDebugBanner = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev || !isArabic) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-green-600 text-white py-1 px-2 text-center text-sm z-[9999]">
      🟢 Arabisch aktiviert – RTL-Modus aktiv (dir: {document.documentElement.dir})
    </div>
  );
};
