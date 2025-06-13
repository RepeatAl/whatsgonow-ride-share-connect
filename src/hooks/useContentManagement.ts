
// [LOCKED: Do not modify without CTO approval – siehe docs/locks/CONTENT_FAQ_LOCK.md]

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Types for content management
export interface LegalPage {
  id: string;
  slug: string;
  default_title: string;
  default_content: string;
  page_type: string;
  active: boolean;
  requires_cto_approval: boolean;
  last_approved_by?: string;
  last_approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LegalPageTranslation {
  id: string;
  legal_page_id: string;
  lang_code: string;
  title: string;
  content: string;
  status: 'draft' | 'auto' | 'verified' | 'approved';
  last_synced?: string;
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  id: string;
  category: string;
  default_question: string;
  default_answer: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQTranslation {
  id: string;
  faq_id: string;
  lang_code: string;
  question: string;
  answer: string;
  status: 'draft' | 'auto' | 'verified' | 'approved';
  last_synced?: string;
  created_at: string;
  updated_at: string;
}

export interface FooterLink {
  id: string;
  label_default: string;
  slug: string;
  section: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FooterLinkTranslation {
  id: string;
  footer_link_id: string;
  lang_code: string;
  label: string;
  created_at: string;
  updated_at: string;
}

// Enhanced FAQ Item with translation data
export interface FAQItemWithTranslation extends FAQItem {
  question: string;
  answer: string;
  translation_status?: string | null;
}

// Enhanced Footer Link with translation data
export interface FooterLinkWithTranslation extends FooterLink {
  label: string;
}

// CRITICAL FIX: Get current language WITHOUT any Profile/Auth dependency
const getCurrentLanguageSimple = (): string => {
  // 1. Try URL path first (most reliable for public pages)
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts.length > 0 && ['de', 'en', 'ar', 'pl', 'fr', 'es'].includes(pathParts[0])) {
    return pathParts[0];
  }

  // 2. Try URL search parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && ['de', 'en', 'ar', 'pl', 'fr', 'es'].includes(urlLang)) {
    return urlLang;
  }

  // 3. Try localStorage (but NO i18next or any external dependency)
  try {
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang && ['de', 'en', 'ar', 'pl', 'fr', 'es'].includes(storedLang)) {
      return storedLang;
    }
  } catch (err) {
    // Silent fallback
  }

  // 4. Try browser language as final fallback
  const browserLang = navigator.language.split('-')[0];
  if (['de', 'en', 'ar', 'pl', 'fr', 'es'].includes(browserLang)) {
    return browserLang;
  }

  // 5. Default fallback
  return 'de';
};

// Hook for legal pages management - COMPLETELY PUBLIC SAFE
export const useLegalPages = () => {
  const [currentLanguage] = useState(getCurrentLanguageSimple());
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLegalPages = async (): Promise<LegalPage[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // CRITICAL: Direct query without any auth context
      const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .eq('active', true)
        .order('created_at');

      if (error) throw error;
      const pages = data || [];
      setLegalPages(pages);
      return pages;
    } catch (err) {
      console.error('Error fetching legal pages:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getLegalPageWithTranslation = async (slug: string) => {
    try {
      // CRITICAL: Direct query without any auth context
      const { data: page, error: pageError } = await supabase
        .from('legal_pages')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (pageError) throw pageError;

      // Get translation for current language - NO auth context
      const { data: translation, error: translationError } = await supabase
        .from('legal_page_translations')
        .select('*')
        .eq('legal_page_id', page.id)
        .eq('lang_code', currentLanguage)
        .single();

      // Return page with translation if available, otherwise default content
      return {
        ...page,
        title: translation?.title || page.default_title,
        content: translation?.content || page.default_content,
        translation_status: translation?.status || null
      };
    } catch (err) {
      console.error('Error fetching legal page:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchLegalPages();
  }, []);

  return {
    legalPages,
    loading,
    error,
    fetchLegalPages,
    getLegalPageWithTranslation
  };
};

// Hook for FAQ management - COMPLETELY PUBLIC SAFE, NO AUTH DEPENDENCY
export const useFAQ = () => {
  const [currentLanguage] = useState(getCurrentLanguageSimple());
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFAQ = async (): Promise<FAQItem[]> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[FAQ] Fetching FAQ items directly from table...');
      
      // CRITICAL FIX: Direct query to FAQ table only, NO joins, NO auth context
      const { data, error } = await supabase
        .from('faq')
        .select('id, category, default_question, default_answer, order_index, active, created_at, updated_at')
        .eq('active', true)
        .order('category')
        .order('order_index');

      if (error) {
        console.error('[FAQ] Error fetching FAQ items:', error);
        throw error;
      }
      
      console.log('[FAQ] Successfully fetched FAQ items:', data?.length || 0);
      const items = data || [];
      setFaqItems(items);
      return items;
    } catch (err) {
      console.error('[FAQ] Error fetching FAQ:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getFAQWithTranslations = async (): Promise<FAQItemWithTranslation[]> => {
    try {
      setError(null);
      console.log('[FAQ] Getting FAQ with translations for language:', currentLanguage);
      
      // STEP 1: Get FAQ items first (completely separate)
      const { data: faqData, error: faqError } = await supabase
        .from('faq')
        .select('id, category, default_question, default_answer, order_index, active, created_at, updated_at')
        .eq('active', true)
        .order('category')
        .order('order_index');

      if (faqError) {
        console.error('[FAQ] FAQ fetch error:', faqError);
        throw faqError;
      }

      if (!faqData || faqData.length === 0) {
        console.log('[FAQ] No FAQ items found');
        return [];
      }

      console.log('[FAQ] Found FAQ items:', faqData.length);

      // STEP 2: Get translations separately (no join, no auth context)
      const { data: translationsData, error: translationsError } = await supabase
        .from('faq_translations')
        .select('faq_id, lang_code, question, answer, status')
        .eq('lang_code', currentLanguage);

      if (translationsError) {
        console.warn('[FAQ] Translation fetch error, using defaults:', translationsError);
        // Continue with default content instead of failing
      }

      console.log('[FAQ] Found translations:', translationsData?.length || 0);

      // STEP 3: Merge data manually (no database join)
      const translationsMap = new Map();
      if (translationsData) {
        translationsData.forEach(trans => {
          translationsMap.set(trans.faq_id, trans);
        });
      }

      const result = faqData.map(item => {
        const translation = translationsMap.get(item.id);
        return {
          ...item,
          question: translation?.question || item.default_question,
          answer: translation?.answer || item.default_answer,
          translation_status: translation?.status || null
        };
      });

      console.log('[FAQ] Final FAQ with translations:', result.length);
      return result;
    } catch (err) {
      console.error('[FAQ] Error fetching FAQ with translations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load FAQ');
      return [];
    }
  };

  useEffect(() => {
    fetchFAQ();
  }, []);

  return {
    faqItems,
    loading,
    error,
    fetchFAQ,
    getFAQWithTranslations
  };
};

// Hook for footer links management - COMPLETELY PUBLIC SAFE
export const useFooterLinks = () => {
  const [currentLanguage] = useState(getCurrentLanguageSimple());
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFooterLinks = async (): Promise<FooterLink[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // CRITICAL: Direct query without any auth context
      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .eq('active', true)
        .order('section')
        .order('order_index');

      if (error) throw error;
      const links = data || [];
      setFooterLinks(links);
      return links;
    } catch (err) {
      console.error('Error fetching footer links:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getFooterLinksWithTranslations = async (): Promise<FooterLinkWithTranslation[]> => {
    try {
      setError(null);
      
      // STEP 1: Get footer links first
      const { data: linksData, error: linksError } = await supabase
        .from('footer_links')
        .select('*')
        .eq('active', true)
        .order('section')
        .order('order_index');

      if (linksError) throw linksError;

      if (!linksData || linksData.length === 0) {
        return [];
      }

      // STEP 2: Get translations separately
      const { data: translationsData, error: translationsError } = await supabase
        .from('footer_link_translations')
        .select('footer_link_id, lang_code, label')
        .eq('lang_code', currentLanguage);

      if (translationsError) {
        console.warn('Error fetching footer link translations, using defaults:', translationsError);
      }

      // STEP 3: Merge manually
      const translationsMap = new Map();
      if (translationsData) {
        translationsData.forEach(trans => {
          translationsMap.set(trans.footer_link_id, trans);
        });
      }

      return linksData.map(link => {
        const translation = translationsMap.get(link.id);
        return {
          ...link,
          label: translation?.label || link.label_default
        };
      });
    } catch (err) {
      console.error('Error fetching footer links with translations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load footer links');
      return [];
    }
  };

  const getFooterLinksBySection = async (section: string): Promise<FooterLinkWithTranslation[]> => {
    const links = await getFooterLinksWithTranslations();
    return Array.isArray(links) ? links.filter(link => link.section === section) : [];
  };

  useEffect(() => {
    fetchFooterLinks();
  }, []);

  return {
    footerLinks,
    loading,
    error,
    fetchFooterLinks,
    getFooterLinksWithTranslations,
    getFooterLinksBySection
  };
};
