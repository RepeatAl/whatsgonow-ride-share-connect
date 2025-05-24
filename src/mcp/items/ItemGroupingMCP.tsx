
import React, { createContext, useContext } from 'react';

interface ItemGroupingMCPContextType {
  groupedItems: any[];
  groupingStrategy: string;
  setGroupingStrategy: (strategy: string) => void;
}

const ItemGroupingMCPContext = createContext<ItemGroupingMCPContextType | undefined>(undefined);

interface ItemGroupingMCPProps {
  children: React.ReactNode;
}

/**
 * Item Grouping MCP - Stub Implementation for Phase 1
 * Minimal implementation to prevent import errors
 */
export const ItemGroupingMCP: React.FC<ItemGroupingMCPProps> = ({ children }) => {
  console.log('[ITEM-GROUPING-MCP] Stub implementation - not yet active');

  const contextValue: ItemGroupingMCPContextType = {
    groupedItems: [],
    groupingStrategy: 'default',
    setGroupingStrategy: () => console.log('[ITEM-GROUPING-MCP] setGroupingStrategy - stub'),
  };

  return (
    <ItemGroupingMCPContext.Provider value={contextValue}>
      {children}
    </ItemGroupingMCPContext.Provider>
  );
};

export const useItemGroupingMCP = () => {
  const context = useContext(ItemGroupingMCPContext);
  if (context === undefined) {
    throw new Error('useItemGroupingMCP must be used within an ItemGroupingMCP');
  }
  return context;
};
