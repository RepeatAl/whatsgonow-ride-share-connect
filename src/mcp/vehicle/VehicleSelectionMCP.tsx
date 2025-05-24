
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

interface Vehicle {
  id: string;
  type: 'car' | 'van' | 'truck' | 'motorcycle';
  capacity: number;
  available: boolean;
}

interface VehicleSelectionMCPContextType {
  selectedVehicle: Vehicle | null;
  availableVehicles: Vehicle[];
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  validateVehicleForOrder: (orderId: string) => boolean;
  getVehicleRecommendations: (orderRequirements: any) => Vehicle[];
}

const VehicleSelectionMCPContext = createContext<VehicleSelectionMCPContextType | undefined>(undefined);

interface VehicleSelectionMCPProps {
  children: React.ReactNode;
}

/**
 * Vehicle Selection MCP - Master Control Point for vehicle-related operations
 * Handles: Vehicle selection, validation, recommendations, availability
 * Scope: All vehicle-related UI and business logic
 */
export const VehicleSelectionMCP: React.FC<VehicleSelectionMCPProps> = ({ children }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [availableVehicles] = useState<Vehicle[]>([
    { id: '1', type: 'car', capacity: 500, available: true },
    { id: '2', type: 'van', capacity: 1000, available: true },
    { id: '3', type: 'truck', capacity: 5000, available: false },
  ]);

  const validateVehicleForOrder = useCallback((orderId: string): boolean => {
    // Placeholder for vehicle validation logic
    return selectedVehicle?.available ?? false;
  }, [selectedVehicle]);

  const getVehicleRecommendations = useCallback((orderRequirements: any): Vehicle[] => {
    // Placeholder for AI-based vehicle recommendation logic
    return availableVehicles.filter(v => v.available && v.capacity >= (orderRequirements?.weight || 0));
  }, [availableVehicles]);

  const contextValue = useMemo(() => ({
    selectedVehicle,
    availableVehicles,
    setSelectedVehicle,
    validateVehicleForOrder,
    getVehicleRecommendations,
  }), [
    selectedVehicle,
    availableVehicles,
    setSelectedVehicle,
    validateVehicleForOrder,
    getVehicleRecommendations,
  ]);

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
