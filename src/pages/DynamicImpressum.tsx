
import React from 'react';
import { DynamicLegalPage } from '@/components/content/DynamicLegalPage';

const DynamicImpressum: React.FC = () => {
  return (
    <DynamicLegalPage 
      slug="impressum"
      fallbackTitle="Impressum - Whatsgonow"
      fallbackDescription="Impressum und Anbieterkennzeichnung für whatsgonow"
    />
  );
};

export default DynamicImpressum;
