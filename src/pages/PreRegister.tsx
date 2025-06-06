
import React from 'react';
import Layout from '@/components/Layout';
import { PreRegistrationForm } from '@/components/pre-registration/PreRegistrationForm';
import { useTranslation } from 'react-i18next';

const PreRegister = () => {
  const { t } = useTranslation('pre_register');

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('title', 'Für Whatsgonow vorregistrieren')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {t('subtitle', 'Seien Sie bei unserem Launch dabei und erhalten Sie exklusiven Zugang.')}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <PreRegistrationForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PreRegister;
