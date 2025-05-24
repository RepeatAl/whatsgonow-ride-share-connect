
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { UserSuspensionNotice } from "@/components/suspension";
import { useTranslation } from "react-i18next";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  minimal?: boolean;
}

const Layout = React.memo(({ children, hideFooter = false, minimal = false }: LayoutProps) => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <div 
      className="flex flex-col transition-all duration-200 ease-in-out" 
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ 
        minHeight: '100vh',
        width: '100%'
      }}
    >
      <div style={{ height: '64px' }}>
        <Navbar />
      </div>
      
      <main 
        className={`flex-grow ${minimal ? 'pt-0' : ''}`} 
        style={{ 
          minHeight: 'calc(100vh - 64px)',
          paddingTop: minimal ? 0 : undefined
        }}
      >
        <div className={`container mx-auto ${minimal ? 'max-w-none px-0' : ''}`}>
          {user && <UserSuspensionNotice userId={user.id} />}
          {children}
        </div>
      </main>
      
      {!hideFooter && (
        <div style={{ flexShrink: 0 }}>
          <Footer />
        </div>
      )}
      
      <Toaster />
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;
