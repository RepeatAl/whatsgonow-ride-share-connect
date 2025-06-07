
import React from 'react';
import Layout from '@/components/Layout';
import { MapPolicy } from '@/components/map/MapPolicy';
import { useTranslation } from 'react-i18next';

const MapPolicyPage = () => {
  const { t } = useTranslation(['landing', 'common']);

  return (
    <Layout
      title={t('landing:mapPolicy.title', 'HERE Maps Datenschutz & Nutzung')}
      description={t('landing:mapPolicy.whatIs.description', 'Informationen zur datenschutzkonformen Nutzung von HERE Maps')}
      pageType="public"
    >
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <MapPolicy />
        </div>
      </div>
    </Layout>
  );
};

export default MapPolicyPage;
