
import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { supportedLanguages } from '@/config/supportedLanguages';
import { useOptimizedLanguage } from '@/contexts/language/OptimizedLanguageProvider';

interface LanguageSEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
}

export const LanguageSEO: React.FC<LanguageSEOProps> = ({
  title,
  description,
  canonicalPath,
}) => {
  const location = useLocation();
  const { currentLanguage, getLocalizedUrl } = useOptimizedLanguage();
  
  // Build the base URL
  const baseUrl = window.location.origin;
  
  // Determine the canonical path
  const path = canonicalPath || location.pathname;
  const canonicalUrl = `${baseUrl}${path}`;
  
  return (
    <Helmet>
      {/* Language */}
      <html lang={currentLanguage} />
      
      {/* Title and description if provided */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate language URLs */}
      {supportedLanguages.map((lang) => {
        // Skip non-implemented languages (future language support)
        const implementedLanguages = ['de', 'en', 'ar'];
        if (!implementedLanguages.includes(lang.code)) {
          return null;
        }
        
        const langPath = getLocalizedUrl(path, lang.code);
        const alternateUrl = `${baseUrl}${langPath}`;
        
        return (
          <link 
            key={lang.code}
            rel="alternate" 
            href={alternateUrl} 
            hrefLang={lang.code}
          />
        );
      })}
      
      {/* x-default for search engines */}
      <link rel="alternate" href={`${baseUrl}/de${path === '/' ? '' : path}`} hrefLang="x-default" />
    </Helmet>
  );
};

export default LanguageSEO;
