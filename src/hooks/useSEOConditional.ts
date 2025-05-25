
import { useLocation } from 'react-router-dom';

interface SEOConditionalConfig {
  shouldRenderSEO: boolean;
  skipReason?: string;
}

export const useSEOConditional = (): SEOConditionalConfig => {
  const location = useLocation();
  
  // Define routes that should skip SEO
  const skipPatterns = [
    '/api/',
    '/debug/',
    '/_',
    '/admin/test',
    '/mobile-upload/',
    '/delivery/',
    '/invoice-download/'
  ];
  
  // Check if current path should skip SEO
  const shouldSkip = skipPatterns.some(pattern => 
    location.pathname.startsWith(pattern)
  );
  
  if (shouldSkip) {
    return {
      shouldRenderSEO: false,
      skipReason: 'Internal or API route'
    };
  }
  
  // Additional checks for specific conditions
  const isErrorPage = location.pathname === '/404' || location.pathname === '/500';
  if (isErrorPage) {
    return {
      shouldRenderSEO: true, // Error pages should have SEO for better UX
      skipReason: undefined
    };
  }
  
  return {
    shouldRenderSEO: true,
    skipReason: undefined
  };
};
