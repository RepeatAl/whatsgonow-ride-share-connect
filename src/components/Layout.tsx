
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { UserSuspensionNotice } from "@/components/suspension";
import { useTranslation } from "react-i18next";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  minimal?: boolean;
}

const Layout = ({ children, hideFooter = false, minimal = false }: LayoutProps) => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <div 
      className="flex flex-col min-h-screen transition-all duration-200 ease-in-out" 
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ minHeight: '100vh' }} // Verhindert Layout-Sprünge
    >
      <Navbar />
      <main className={`flex-grow ${minimal ? 'pt-0' : ''}`} style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className={`container mx-auto ${minimal ? 'max-w-none px-0' : ''}`}>
          {user && <UserSuspensionNotice userId={user.id} />}
          {children}
        </div>
      </main>
      {!hideFooter && <Footer />}
      <Toaster />
    </div>
  );
};

export default Layout;
