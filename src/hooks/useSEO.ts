
import { useLocation } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { getSEOContent } from '@/data/seoContent';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl: string;
  pageType: string;
}

export const useSEO = (pageType?: string): SEOData => {
  const location = useLocation();
  const { currentLanguage } = useLanguageMCP();
  
  // Determine page type from path if not provided
  const inferPageType = (): string => {
    if (pageType) return pageType;
    
    const path = location.pathname;
    if (path.includes('/login')) return 'login';
    if (path.includes('/register')) return 'register';
    if (path.includes('/pre-register')) return 'pre-register';
    if (path.includes('/support')) return 'support';
    if (path.includes('/faq')) return 'faq';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/orders')) return 'orders';
    
    return 'landing';
  };
  
  const currentPageType = inferPageType();
  const seoContent = getSEOContent(currentLanguage, currentPageType);
  
  // Fallback content if SEO content not found
  const fallbackContent = {
    title: 'Whatsgonow - Crowdlogistik Plattform',
    description: 'Verbinde Auftraggeber und Fahrer für effiziente Transporte',
    keywords: 'Crowdlogistik, Transport, Lieferung, Fahrer'
  };
  
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}${location.pathname}`;
  
  return {
    title: seoContent?.title || fallbackContent.title,
    description: seoContent?.description || fallbackContent.description,
    keywords: seoContent?.keywords || fallbackContent.keywords,
    ogTitle: seoContent?.ogTitle,
    ogDescription: seoContent?.ogDescription,
    canonicalUrl,
    pageType: currentPageType
  };
};
