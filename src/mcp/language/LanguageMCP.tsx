
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { changeAppLanguage } from '@/services/LanguageService';
import { supabase } from '@/lib/supabaseClient';
import MCPErrorBoundary from '@/mcp/components/MCPErrorBoundary';

// Language MCP Types
export interface LanguageMCPContextType {
  currentLanguage: string;
  setLanguageByCode: (languageCode: string) => Promise<void>;
  getLocalizedUrl: (path: string) => string;
  languageLoading: boolean;
  supportedLanguages: Array<{ code: string; name: string; nativeName: string; flag: string }>;
  isRtl: boolean;
}

// Supported languages configuration
const SUPPORTED_LANGUAGES = [
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
];

const RTL_LANGUAGES = ['ar'];

// Create the context
const LanguageMCPContext = createContext<LanguageMCPContextType | undefined>(undefined);

interface LanguageMCPProps {
  children: ReactNode;
  initialLanguage?: string;
}

export const LanguageMCP: React.FC<LanguageMCPProps> = ({ 
  children, 
  initialLanguage = 'de' 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(initialLanguage);
  const [languageLoading, setLanguageLoading] = useState<boolean>(false);
  const { user } = useAuth();

  console.log('[LANGUAGE-MCP] Initializing with language:', initialLanguage);
  console.log('[LANGUAGE-MCP] Current user:', user?.email || 'none');

  // Initialize language on mount
  useEffect(() => {
    console.log('[LANGUAGE-MCP] Setting up initial language:', initialLanguage);
    setCurrentLanguage(initialLanguage);
    
    // Change app language immediately
    changeAppLanguage(initialLanguage).catch((error) => {
      console.error('[LANGUAGE-MCP] Failed to set initial language:', error);
    });
  }, [initialLanguage]);

  // Language change handler with user profile update
  const setLanguageByCode = useCallback(async (languageCode: string) => {
    console.log('[LANGUAGE-MCP] Changing language to:', languageCode);
    
    if (!SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode)) {
      console.error('[LANGUAGE-MCP] Unsupported language code:', languageCode);
      return;
    }

    try {
      setLanguageLoading(true);
      
      // Change app language
      await changeAppLanguage(languageCode);
      
      // Update local state
      setCurrentLanguage(languageCode);
      
      // Update user profile if authenticated
      if (user) {
        console.log('[LANGUAGE-MCP] Updating user language preference in database');
        const { error } = await supabase
          .from('profiles')
          .update({ language: languageCode })
          .eq('user_id', user.id);
          
        if (error) {
          console.error('[LANGUAGE-MCP] Failed to update user language preference:', error);
        }
      }
      
      console.log('[LANGUAGE-MCP] Language change completed successfully');
    } catch (error) {
      console.error('[LANGUAGE-MCP] Language change failed:', error);
    } finally {
      setLanguageLoading(false);
    }
  }, [user]);

  // URL localization with enhanced debugging
  const getLocalizedUrl = useCallback((path: string): string => {
    console.log('[LANGUAGE-MCP] getLocalizedUrl called with path:', path);
    console.log('[LANGUAGE-MCP] Current language:', currentLanguage);
    
    // Remove leading slash for consistency
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const localizedUrl = `/${currentLanguage}${cleanPath ? `/${cleanPath}` : ''}`;
    
    console.log('[LANGUAGE-MCP] Generated URL:', localizedUrl);
    return localizedUrl;
  }, [currentLanguage]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    currentLanguage,
    setLanguageByCode,
    getLocalizedUrl,
    languageLoading,
    supportedLanguages: SUPPORTED_LANGUAGES,
    isRtl: RTL_LANGUAGES.includes(currentLanguage)
  }), [currentLanguage, setLanguageByCode, getLocalizedUrl, languageLoading]);

  console.log('[LANGUAGE-MCP] Context value:', {
    currentLanguage: contextValue.currentLanguage,
    languageLoading: contextValue.languageLoading,
    isRtl: contextValue.isRtl
  });

  return (
    <MCPErrorBoundary>
      <LanguageMCPContext.Provider value={contextValue}>
        {children}
      </LanguageMCPContext.Provider>
    </MCPErrorBoundary>
  );
};

// Custom hook to use Language MCP
export const useLanguageMCP = (): LanguageMCPContextType => {
  const context = useContext(LanguageMCPContext);
  
  if (context === undefined) {
    throw new Error('useLanguageMCP must be used within a LanguageMCP');
  }
  
  return context;
};

export default LanguageMCP;
