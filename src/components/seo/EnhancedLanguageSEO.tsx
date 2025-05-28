
import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { supportedLanguages } from '@/config/supportedLanguages';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalPath?: string;
}

// Use the same type definition as in useSEO
type SEOPageType = 'landing' | 'login' | 'register' | 'pre-register' | 'support' | 'faq' | 'profile' | 'orders';

export interface EnhancedLanguageSEOProps extends SEOMetadata {
  pageType?: SEOPageType;
}

export const EnhancedLanguageSEO: React.FC<EnhancedLanguageSEOProps> = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  canonicalPath,
  pageType = 'landing'
}) => {
  const location = useLocation();
  const { currentLanguage, getLocalizedUrl } = useLanguageMCP();
  
  // Build the base URL
  const baseUrl = window.location.origin;
  
  // Determine the canonical path
  const path = canonicalPath || location.pathname;
  const canonicalUrl = `${baseUrl}${path}`;
  
  // Enhanced Open Graph image with fallback
  const defaultOgImage = `${baseUrl}/logo.png`;
  const ogImageUrl = ogImage || defaultOgImage;
  
  // Language and country mapping
  const languageCountryMap: Record<string, string> = {
    'de': 'de-DE',
    'en': 'en-US', 
    'ar': 'ar-SA'
  };
  
  // Enhanced fallback content based on page type
  const getPageTypeDefaults = () => {
    const defaults = {
      landing: {
        title: currentLanguage === 'de' ? 'Whatsgonow - Crowdlogistik Plattform' : 
               currentLanguage === 'ar' ? 'Whatsgonow - منصة اللوجستيات الجماعية' :
               'Whatsgonow - Crowd Logistics Platform',
        description: currentLanguage === 'de' ? 'Verbinde Auftraggeber und Fahrer für effiziente Transporte' :
                    currentLanguage === 'ar' ? 'اربط بين المقاولين والسائقين للنقل الفعال' :
                    'Connect contractors and drivers for efficient transport'
      }
    };
    return defaults[pageType] || defaults.landing;
  };
  
  const pageDefaults = getPageTypeDefaults();
  const finalTitle = title || pageDefaults.title;
  const finalDescription = description || pageDefaults.description;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLanguage} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Tags for SEO */}
      {supportedLanguages.map((lang) => {
        // Only generate for implemented languages
        const implementedLanguages = ['de', 'en', 'ar'];
        if (!implementedLanguages.includes(lang.code)) {
          return null;
        }
        
        // Create localized path manually since getLocalizedUrl only accepts one param
        const pathWithoutLang = path.replace(/^\/[a-z]{2}/, '') || '/';
        const langPath = `/${lang.code}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
        const alternateUrl = `${baseUrl}${langPath}`;
        const hreflangCode = languageCountryMap[lang.code] || lang.code;
        
        return (
          <link 
            key={lang.code}
            rel="alternate" 
            href={alternateUrl} 
            hrefLang={hreflangCode}
          />
        );
      })}
      
      {/* x-default for search engines (German as default) */}
      <link rel="alternate" href={`${baseUrl}/de${path === '/' ? '' : path}`} hrefLang="x-default" />
      
      {/* Enhanced Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={ogTitle || finalTitle} />
      <meta property="og:description" content={ogDescription || finalDescription} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogTitle || finalTitle} />
      <meta property="og:locale" content={languageCountryMap[currentLanguage] || currentLanguage} />
      <meta property="og:site_name" content="Whatsgonow" />
      
      {/* Enhanced Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || finalTitle} />
      <meta name="twitter:description" content={ogDescription || finalDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={ogTitle || finalTitle} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Whatsgonow" />
      <meta name="copyright" content="© 2024 Whatsgonow" />
      <meta name="theme-color" content="#FF6B35" />
      
      {/* Enhanced JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Whatsgonow",
          "url": baseUrl,
          "description": finalDescription,
          "inLanguage": currentLanguage,
          "image": ogImageUrl,
          "sameAs": [
            "https://facebook.com/whatsgonow",
            "https://twitter.com/whatsgonow"
          ],
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Whatsgonow",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          }
        })}
      </script>
    </Helmet>
  );
};

export default EnhancedLanguageSEO;
