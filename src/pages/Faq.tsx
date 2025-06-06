import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Faq = () => {
  const { t } = useTranslation(['faq', 'common']);

  return (
    <Layout pageType="public">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">{t('faq:title')}</h1>
          <p className="text-gray-600 text-center mb-12">{t('faq:subtitle')}</p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t('faq:question1')}</AccordionTrigger>
              <AccordionContent>
                {t('faq:answer1')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>{t('faq:question2')}</AccordionTrigger>
              <AccordionContent>
                {t('faq:answer2')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>{t('faq:question3')}</AccordionTrigger>
              <AccordionContent>
                {t('faq:answer3')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>{t('faq:question4')}</AccordionTrigger>
              <AccordionContent>
                {t('faq:answer4')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Layout>
  );
};

export default Faq;
