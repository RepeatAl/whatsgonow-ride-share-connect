
import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";

const Home = () => {
  const { t, i18n } = useTranslation(['landing', 'common']);
  const isRTL = i18n.language === 'ar';

  return (
    <Layout pageType="landing">
      <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
        <Hero />
        
        {/* Placeholder für weitere Sections */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              {t('landing:features.title', 'Unsere Features')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('landing:features.subtitle', 'Entdecke die Möglichkeiten von Whatsgonow')}
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
