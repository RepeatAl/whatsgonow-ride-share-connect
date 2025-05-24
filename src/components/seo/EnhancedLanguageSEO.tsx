
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

interface EnhancedLanguageSEOProps extends SEOMetadata {
  pageType?: 'landing' | 'login' | 'register' | 'support' | 'faq' | 'profile' | 'orders';
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
  
  // Default Open Graph image
  const defaultOgImage = `${baseUrl}/logo.png`;
  
  // Language and country mapping
  const languageCountryMap: Record<string, string> = {
    'de': 'de-DE',
    'en': 'en-US', 
    'ar': 'ar-SA'
  };
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLanguage} />
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
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
        
        const langPath = getLocalizedUrl(path, lang.code);
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
      
      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={ogTitle || title || 'Whatsgonow - Crowdlogistik Plattform'} />
      <meta property="og:description" content={ogDescription || description || 'Verbinde Auftraggeber und Fahrer für effiziente Transporte'} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:locale" content={languageCountryMap[currentLanguage] || currentLanguage} />
      <meta property="og:site_name" content="Whatsgonow" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title || 'Whatsgonow'} />
      <meta name="twitter:description" content={ogDescription || description || 'Crowdlogistik Plattform'} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Whatsgonow" />
      <meta name="copyright" content="© 2024 Whatsgonow" />
      <meta name="theme-color" content="#FF6B35" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Whatsgonow",
          "url": baseUrl,
          "description": description || "Crowdlogistik-Plattform für effiziente Transporte",
          "inLanguage": currentLanguage,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default EnhancedLanguageSEO;
