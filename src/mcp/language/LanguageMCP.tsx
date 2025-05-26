
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

  // Initialize language on mount
  useEffect(() => {
    setCurrentLanguage(initialLanguage);
    
    // Change app language immediately
    changeAppLanguage(initialLanguage).catch((error) => {
      console.error('[LANGUAGE-MCP] Failed to set initial language:', error);
    });
  }, [initialLanguage]);

  // Language change handler with user profile update
  const setLanguageByCode = useCallback(async (languageCode: string) => {
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
        const { error } = await supabase
          .from('profiles')
          .update({ language: languageCode })
          .eq('user_id', user.id);
          
        if (error) {
          console.error('[LANGUAGE-MCP] Failed to update user language preference:', error);
        }
      }
    } catch (error) {
      console.error('[LANGUAGE-MCP] Language change failed:', error);
    } finally {
      setLanguageLoading(false);
    }
  }, [user]);

  // URL localization
  const getLocalizedUrl = useCallback((path: string): string => {
    // Remove leading slash for consistency
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const localizedUrl = `/${currentLanguage}${cleanPath ? `/${cleanPath}` : ''}`;
    
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
