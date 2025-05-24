
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

interface ChatLanguageMCPContextType {
  chatLanguage: string;
  autoTranslateEnabled: boolean;
  setChatLanguage: (lang: string) => void;
  toggleAutoTranslate: () => void;
  translateMessage: (message: string, targetLang: string) => Promise<string>;
}

const ChatLanguageMCPContext = createContext<ChatLanguageMCPContextType | undefined>(undefined);

interface ChatLanguageMCPProps {
  children: React.ReactNode;
}

/**
 * Chat Language MCP - Master Control Point for chat-specific language operations
 * Handles: Real-time message translation, chat-specific language preferences
 * Scope: Chat module only, independent from global UI language
 */
export const ChatLanguageMCP: React.FC<ChatLanguageMCPProps> = ({ children }) => {
  const [chatLanguage, setChatLanguage] = useState<string>('de');
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState<boolean>(false);

  const toggleAutoTranslate = useCallback(() => {
    setAutoTranslateEnabled(prev => !prev);
  }, []);

  const translateMessage = useCallback(async (message: string, targetLang: string): Promise<string> => {
    // Placeholder for actual translation service integration
    // This would integrate with Google Translate, DeepL, or similar
    return `[${targetLang.toUpperCase()}] ${message}`;
  }, []);

  const contextValue = useMemo(() => ({
    chatLanguage,
    autoTranslateEnabled,
    setChatLanguage,
    toggleAutoTranslate,
    translateMessage,
  }), [
    chatLanguage,
    autoTranslateEnabled,
    setChatLanguage,
    toggleAutoTranslate,
    translateMessage,
  ]);

  return (
    <ChatLanguageMCPContext.Provider value={contextValue}>
      {children}
    </ChatLanguageMCPContext.Provider>
  );
};

export const useChatLanguageMCP = () => {
  const context = useContext(ChatLanguageMCPContext);
  if (context === undefined) {
    throw new Error('useChatLanguageMCP must be used within a ChatLanguageMCP');
  }
  return context;
};
