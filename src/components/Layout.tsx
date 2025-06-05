
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/toaster";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { UserSuspensionNotice } from "@/components/suspension";
import { useTranslation } from "react-i18next";
import React from "react";
import { EnhancedLanguageSEO } from "@/components/seo/EnhancedLanguageSEO";
import { useSEO } from "@/hooks/useSEO";
import { BackButton } from "@/components/navigation/BackButton";
import { HomeButton } from "@/components/navigation/HomeButton";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  minimal?: boolean;
  disableSEO?: boolean;
  pageType?: string;
  hideNavigation?: boolean;
}

const Layout = React.memo(({ 
  children, 
  hideFooter = false, 
  minimal = false, 
  disableSEO = false,
  pageType,
  hideNavigation = false
}: LayoutProps) => {
  const { user } = useSimpleAuth();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Get SEO data with automatic pageType detection or use provided pageType
  const seoData = useSEO(pageType);
  
  return (
    <>
      {/* Automatic SEO for all pages using Layout */}
      {!disableSEO && <EnhancedLanguageSEO {...seoData} />}
      
      <div 
        className="flex flex-col transition-all duration-200 ease-in-out" 
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ 
          minHeight: '100vh',
          width: '100%'
        }}
      >
        {!hideNavigation && (
          <div style={{ height: '64px' }}>
            <Navbar />
          </div>
        )}
        
        <main 
          className={`flex-grow ${minimal ? 'pt-0' : ''}`} 
          style={{ 
            minHeight: hideNavigation ? '100vh' : 'calc(100vh - 64px)',
            paddingTop: minimal ? 0 : undefined
          }}
        >
          <div className={`${minimal ? 'max-w-none px-0' : 'container mx-auto'}`}>
            {user && <UserSuspensionNotice userId={user.id} />}
            
            {/* Navigation Buttons - only show when navigation is not hidden and user is authenticated */}
            {!hideNavigation && user && (
              <div className="flex items-center gap-2 p-4 border-b bg-gray-50 dark:bg-gray-900">
                <BackButton />
                <HomeButton />
              </div>
            )}
            
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
    </>
  );
});

Layout.displayName = "Layout";

export default Layout;
