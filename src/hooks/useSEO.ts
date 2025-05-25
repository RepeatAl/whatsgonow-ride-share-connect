
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
  
  // Check if SEO is needed for this route (performance optimization)
  const shouldSkipSEO = (): boolean => {
    const path = location.pathname;
    const skipPaths = ['/api', '/debug', '/_', '/admin/test'];
    return skipPaths.some(skipPath => path.startsWith(skipPath));
  };
  
  // Enhanced automatic pageType detection
  const inferPageType = (): string => {
    if (pageType) return pageType;
    
    const path = location.pathname;
    
    // Remove language prefix for path matching
    const pathSegments = path.split('/').filter(Boolean);
    const cleanPath = pathSegments.length > 1 && ['de', 'en', 'ar'].includes(pathSegments[0])
      ? '/' + pathSegments.slice(1).join('/')
      : path;
    
    // Route-based pageType mapping
    const routeMap: Record<string, string> = {
      '/': 'landing',
      '/login': 'login',
      '/register': 'register',
      '/pre-register': 'pre-register',
      '/register/success': 'register',
      '/pre-register/success': 'pre-register',
      '/forgot-password': 'login',
      '/reset-password': 'login',
      '/faq': 'faq',
      '/support': 'support',
      '/legal': 'support',
      '/privacy-policy': 'support',
      '/profile': 'profile',
      '/complete-profile': 'profile',
      '/dashboard': 'profile',
      '/orders': 'orders',
      '/create-order': 'orders',
      '/offer-transport': 'orders'
    };
    
    // Check exact matches first
    if (routeMap[cleanPath]) {
      return routeMap[cleanPath];
    }
    
    // Check path patterns
    if (cleanPath.startsWith('/dashboard')) return 'profile';
    if (cleanPath.startsWith('/orders')) return 'orders';
    if (cleanPath.startsWith('/admin')) return 'profile';
    if (cleanPath.startsWith('/deal/')) return 'orders';
    if (cleanPath.startsWith('/tracking/')) return 'orders';
    
    // Default fallback
    return 'landing';
  };
  
  // Skip SEO for internal routes
  if (shouldSkipSEO()) {
    return {
      title: 'Whatsgonow',
      description: '',
      keywords: '',
      canonicalUrl: '',
      pageType: 'internal'
    };
  }
  
  const currentPageType = inferPageType();
  const seoContent = getSEOContent(currentLanguage, currentPageType);
  
  // Enhanced fallback content with language awareness
  const getFallbackContent = () => {
    const fallbacks: Record<string, any> = {
      de: {
        title: 'Whatsgonow - Crowdlogistik Plattform',
        description: 'Verbinde Auftraggeber und Fahrer für effiziente Transporte',
        keywords: 'Crowdlogistik, Transport, Lieferung, Fahrer'
      },
      en: {
        title: 'Whatsgonow - Crowd Logistics Platform',
        description: 'Connect contractors and drivers for efficient transport',
        keywords: 'Crowd logistics, Transport, Delivery, Driver'
      },
      ar: {
        title: 'Whatsgonow - منصة اللوجستيات الجماعية',
        description: 'اربط بين المقاولين والسائقين للنقل الفعال',
        keywords: 'اللوجستيات الجماعية, النقل, التسليم, السائق'
      }
    };
    
    return fallbacks[currentLanguage] || fallbacks['de'];
  };
  
  const fallbackContent = getFallbackContent();
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
