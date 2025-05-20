
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Benefits from "@/components/home/Benefits";
import UserGroups from "@/components/home/UserGroups";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, LogIn, LayoutDashboard, MessageCircle } from "lucide-react";
import { useLaunch } from "@/components/launch/LaunchProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { isLaunchReady, isTest } = useLaunch();
  const { user } = useAuth();
  const { t, i18n, ready } = useTranslation(['landing', 'common']);
  
  const showFeedbackButton = isLaunchReady || isTest;
  const isRTL = i18n.language === 'ar';
  
  // Debug translations in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[INDEX-DEBUG] Landing namespace loaded:', i18n.hasResourceBundle(i18n.language, 'landing'));
      console.log('[INDEX-DEBUG] Common namespace loaded:', i18n.hasResourceBundle(i18n.language, 'common'));
      console.log('[INDEX-DEBUG] Current language:', i18n.language);
      console.log('[INDEX-DEBUG] Translation ready:', ready);
      console.log('[INDEX-DEBUG] Direction:', document.documentElement.dir);
    }
  }, [i18n, ready]);

  if (!ready) {
    return (
      <Layout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-t-brand-orange border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {i18n.language === 'de' ? 'Lade Inhalte...' : 
               i18n.language === 'en' ? 'Loading content...' : 
               'جاري تحميل المحتوى...'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <Benefits />
      <UserGroups />
      <Testimonials />
      <CTA />
      
      <div className="fixed bottom-6 right-6 z-10 flex flex-col gap-3">
        {user ? (
          <Button asChild className="rounded-full h-14 w-14 p-0" variant="accent">
            <Link to="/dashboard">
              <LayoutDashboard className="h-6 w-6" />
              <span className="sr-only">{t('landing:nav.dashboard')}</span>
            </Link>
          </Button>
        ) : (
          <Button asChild className="rounded-full h-14 w-14 p-0" variant="accent">
            <Link to="/login">
              <LogIn className="h-6 w-6" />
              <span className="sr-only">{t('auth.login', 'Login')}</span>
            </Link>
          </Button>
        )}
        
        <Button asChild className="rounded-full h-14 w-14 p-0" variant="outline">
          <Link to="/inbox">
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">{t('landing:nav.messages', 'Messages')}</span>
          </Link>
        </Button>
        
        {showFeedbackButton && (
          <Button asChild className="rounded-full h-14 w-14 p-0">
            <Link to="/feedback">
              <MessageSquare className="h-6 w-6" />
              <span className="sr-only">{t('feedback.header.title', 'Feedback')}</span>
            </Link>
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default Index;
