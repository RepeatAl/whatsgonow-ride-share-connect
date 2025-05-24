
import React, { createContext, useContext } from 'react';

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
 * Chat Language MCP - Stub Implementation for Phase 1
 * Minimal implementation to prevent import errors
 */
export const ChatLanguageMCP: React.FC<ChatLanguageMCPProps> = ({ children }) => {
  console.log('[CHAT-LANGUAGE-MCP] Stub implementation - not yet active');

  const contextValue: ChatLanguageMCPContextType = {
    chatLanguage: 'de',
    autoTranslateEnabled: false,
    setChatLanguage: () => console.log('[CHAT-LANGUAGE-MCP] setChatLanguage - stub'),
    toggleAutoTranslate: () => console.log('[CHAT-LANGUAGE-MCP] toggleAutoTranslate - stub'),
    translateMessage: async () => 'Stub translation',
  };

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
