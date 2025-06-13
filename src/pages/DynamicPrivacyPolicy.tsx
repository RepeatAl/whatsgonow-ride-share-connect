
import React from 'react';
import { DynamicLegalPage } from '@/components/content/DynamicLegalPage';

const DynamicPrivacyPolicy: React.FC = () => {
  return (
    <DynamicLegalPage 
      slug="privacy-policy"
      fallbackTitle="Datenschutzerklärung - Whatsgonow"
      fallbackDescription="Datenschutzerklärung und Informationen zur Datenverarbeitung bei Whatsgonow"
    />
  );
};

export default DynamicPrivacyPolicy;
