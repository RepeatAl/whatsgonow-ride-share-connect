
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import FaqCategory from '@/components/faq/FaqCategory';
import FaqSearch from '@/components/faq/FaqSearch';
import FaqContactSupport from '@/components/faq/FaqContactSupport';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Faq = () => {
  const { t } = useTranslation(['faq', 'common']);
  const [searchTerm, setSearchTerm] = useState('');

  // FAQ-Daten aus der i18n-Struktur laden
  const faqQuestions = t('faq:questions', { returnObjects: true }) as Record<string, { question: string; answer: string }>;
  
  // Strukturierte FAQ-Daten für Kategorien
  const faqData = [
    {
      category: t('faq:categories.general'),
      items: [
        {
          question: faqQuestions.what_is_whatsgonow?.question || 'Was ist whatsgonow?',
          answer: faqQuestions.what_is_whatsgonow?.answer || 'whatsgonow ist eine Crowdlogistik-Plattform...',
          category: t('faq:categories.general')
        }
      ]
    },
    {
      category: t('faq:categories.registration'),
      items: [
        {
          question: faqQuestions.registration_required?.question || 'Muss ich mich registrieren?',
          answer: faqQuestions.registration_required?.answer || 'Ja, für die Nutzung aller Funktionen...',
          category: t('faq:categories.registration')
        }
      ]
    },
    {
      category: t('faq:categories.orders'),
      items: [
        {
          question: faqQuestions.find_transport_orders?.question || 'Wie finde ich Transportaufträge?',
          answer: faqQuestions.find_transport_orders?.answer || 'Nach der Registrierung kannst du...',
          category: t('faq:categories.orders')
        }
      ]
    },
    {
      category: t('faq:categories.payment'),
      items: [
        {
          question: faqQuestions.payment_process?.question || 'Wie funktioniert die Bezahlung?',
          answer: faqQuestions.payment_process?.answer || 'Die Bezahlung erfolgt sicher...',
          category: t('faq:categories.payment')
        }
      ]
    },
    {
      category: t('faq:categories.support'),
      items: [
        {
          question: faqQuestions.problem_handling?.question || 'Was bei Problemen?',
          answer: faqQuestions.problem_handling?.answer || 'Unser Support-Team hilft...',
          category: t('faq:categories.support')
        }
      ]
    }
  ];

  // Filter FAQ-Einträge basierend auf Suchbegriff
  const filteredFaqData = faqData.map(category => ({
    ...category,
    items: category.items.filter(
      item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <Layout 
      pageType="public"
      title={t('faq:page_title')}
      description={t('faq:page_description')}
    >
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-4">
            {t('faq:page_title')}
          </h1>
          <p className="text-gray-600 text-center mb-12">
            {t('faq:page_description')}
          </p>

          {/* Search Input */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={t('faq:search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>

          {/* FAQ Categories */}
          {searchTerm && filteredFaqData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {t('faq:search.no_results')} "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-brand-primary hover:underline"
              >
                {t('faq:search.reset_search')}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {(searchTerm ? filteredFaqData : faqData).map((categoryData, index) => (
                <FaqCategory
                  key={index}
                  category={categoryData.category}
                  items={categoryData.items}
                />
              ))}
            </div>
          )}

          {/* Contact Support Section */}
          <FaqContactSupport />
        </div>
      </div>
    </Layout>
  );
};

export default Faq;
