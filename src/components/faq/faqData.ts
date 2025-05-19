
import { FAQItem } from "@/types/faq";
import i18next from "i18next";

// Helper function to get translated content
const getTranslatedFAQ = (): FAQItem[] => {
  const t = i18next.getFixedT(i18next.language, 'faq');
  
  return [
    {
      category: t('categories.general'),
      question: t('questions.what_is_whatsgonow.question'),
      answer: t('questions.what_is_whatsgonow.answer')
    },
    {
      category: t('categories.registration'),
      question: t('questions.registration_required.question'),
      answer: t('questions.registration_required.answer')
    },
    {
      category: t('categories.orders'),
      question: t('questions.find_transport_orders.question'),
      answer: t('questions.find_transport_orders.answer')
    },
    {
      category: t('categories.payment'),
      question: t('questions.payment_process.question'),
      answer: t('questions.payment_process.answer')
    },
    {
      category: t('categories.support'),
      question: t('questions.problem_handling.question'),
      answer: t('questions.problem_handling.answer')
    }
  ];
};

// Export a function that will always return the current language's FAQs
export const faqItems: FAQItem[] = getTranslatedFAQ();

// Add a listener to update FAQ items when language changes
i18next.on('languageChanged', () => {
  const updatedFAQs = getTranslatedFAQ();
  // Replace all items in the array
  faqItems.splice(0, faqItems.length, ...updatedFAQs);
});
