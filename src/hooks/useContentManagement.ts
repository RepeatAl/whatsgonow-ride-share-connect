
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

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

// Hook for legal pages management
export const useLegalPages = () => {
  const { currentLanguage } = useLanguageMCP();
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLegalPages = async (): Promise<LegalPage[]> => {
    try {
      setLoading(true);
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
      // Get base page
      const { data: page, error: pageError } = await supabase
        .from('legal_pages')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (pageError) throw pageError;

      // Get translation for current language
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

// Hook for FAQ management
export const useFAQ = () => {
  const { currentLanguage } = useLanguageMCP();
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFAQ = async (): Promise<FAQItem[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .eq('active', true)
        .order('category')
        .order('order_index');

      if (error) throw error;
      const items = data || [];
      setFaqItems(items);
      return items;
    } catch (err) {
      console.error('Error fetching FAQ:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getFAQWithTranslations = async (): Promise<FAQItemWithTranslation[]> => {
    try {
      // Get FAQ items with translations
      const { data, error } = await supabase
        .from('faq')
        .select(`
          *,
          faq_translations!inner(
            lang_code,
            question,
            answer,
            status
          )
        `)
        .eq('active', true)
        .eq('faq_translations.lang_code', currentLanguage)
        .order('category')
        .order('order_index');

      if (error) {
        // Fallback to default content if no translations
        const fallbackItems = await fetchFAQ();
        return fallbackItems.map(item => ({
          ...item,
          question: item.default_question,
          answer: item.default_answer,
          translation_status: null
        }));
      }

      return data?.map(item => ({
        ...item,
        question: item.faq_translations?.[0]?.question || item.default_question,
        answer: item.faq_translations?.[0]?.answer || item.default_answer,
        translation_status: item.faq_translations?.[0]?.status || null
      })) || [];
    } catch (err) {
      console.error('Error fetching FAQ with translations:', err);
      // Return empty array instead of throwing
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

// Hook for footer links management
export const useFooterLinks = () => {
  const { currentLanguage } = useLanguageMCP();
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFooterLinks = async (): Promise<FooterLink[]> => {
    try {
      setLoading(true);
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
      const { data, error } = await supabase
        .from('footer_links')
        .select(`
          *,
          footer_link_translations!inner(
            lang_code,
            label
          )
        `)
        .eq('active', true)
        .eq('footer_link_translations.lang_code', currentLanguage)
        .order('section')
        .order('order_index');

      if (error) {
        // Fallback to default labels
        const fallbackLinks = await fetchFooterLinks();
        return fallbackLinks.map(link => ({
          ...link,
          label: link.label_default
        }));
      }

      return data?.map(link => ({
        ...link,
        label: link.footer_link_translations?.[0]?.label || link.label_default
      })) || [];
    } catch (err) {
      console.error('Error fetching footer links with translations:', err);
      return [];
    }
  };

  const getFooterLinksBySection = async (section: string): Promise<FooterLinkWithTranslation[]> => {
    const links = await getFooterLinksWithTranslations();
    return links.filter(link => link.section === section);
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
