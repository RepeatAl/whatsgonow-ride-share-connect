
import React from 'react';
import { DynamicLegalPage } from '@/components/content/DynamicLegalPage';

const DynamicLegal: React.FC = () => {
  return (
    <DynamicLegalPage 
      slug="legal"
      fallbackTitle="Legal & Terms - Whatsgonow"
      fallbackDescription="Rechtliche Bedingungen und Nutzungsbedingungen für whatsgonow"
    />
  );
};

export default DynamicLegal;
