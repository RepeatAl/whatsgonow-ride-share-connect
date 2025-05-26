
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { changeAppLanguage } from '@/services/LanguageService';
import { supabase } from '@/lib/supabaseClient';
import { supportedLanguages, defaultLanguage } from '@/config/supportedLanguages';
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

// Create the context
const LanguageMCPContext = createContext<LanguageMCPContextType | undefined>(undefined);

interface LanguageMCPProps {
  children: ReactNode;
  initialLanguage?: string;
}

export const LanguageMCP: React.FC<LanguageMCPProps> = ({ 
  children, 
  initialLanguage = defaultLanguage 
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
    if (!supportedLanguages.find(lang => lang.code === languageCode)) {
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

  // Convert supportedLanguages format for backward compatibility
  const formattedSupportedLanguages = useMemo(() => 
    supportedLanguages.map(lang => ({
      code: lang.code,
      name: lang.name,
      nativeName: lang.localName, // Map localName to nativeName for backward compatibility
      flag: lang.flag
    })), []
  );

  // Check if current language is RTL
  const isRtl = useMemo(() => {
    const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);
    return currentLang?.rtl || false;
  }, [currentLanguage]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    currentLanguage,
    setLanguageByCode,
    getLocalizedUrl,
    languageLoading,
    supportedLanguages: formattedSupportedLanguages,
    isRtl
  }), [currentLanguage, setLanguageByCode, getLocalizedUrl, languageLoading, formattedSupportedLanguages, isRtl]);

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
