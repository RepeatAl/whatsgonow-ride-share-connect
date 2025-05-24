
import React, { createContext, useContext } from 'react';

interface VehicleSelectionMCPContextType {
  selectedVehicle: string | null;
  availableVehicles: string[];
  setSelectedVehicle: (vehicle: string) => void;
}

const VehicleSelectionMCPContext = createContext<VehicleSelectionMCPContextType | undefined>(undefined);

interface VehicleSelectionMCPProps {
  children: React.ReactNode;
}

/**
 * Vehicle Selection MCP - Stub Implementation for Phase 1
 * Minimal implementation to prevent import errors
 */
export const VehicleSelectionMCP: React.FC<VehicleSelectionMCPProps> = ({ children }) => {
  console.log('[VEHICLE-SELECTION-MCP] Stub implementation - not yet active');

  const contextValue: VehicleSelectionMCPContextType = {
    selectedVehicle: null,
    availableVehicles: [],
    setSelectedVehicle: () => console.log('[VEHICLE-SELECTION-MCP] setSelectedVehicle - stub'),
  };

  return (
    <VehicleSelectionMCPContext.Provider value={contextValue}>
      {children}
    </VehicleSelectionMCPContext.Provider>
  );
};

export const useVehicleSelectionMCP = () => {
  const context = useContext(VehicleSelectionMCPContext);
  if (context === undefined) {
    throw new Error('useVehicleSelectionMCP must be used within a VehicleSelectionMCP');
  }
  return context;
};
