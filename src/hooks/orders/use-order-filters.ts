
import { useState, useEffect } from 'react';
import { Order } from "@/types/order";

export const useOrderFilters = (orders: Order[]) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [maxWeight, setMaxWeight] = useState(100);

  // Helper function to extract region from address
  const extractRegionFromAddress = (address: string) => {
    const regions = ["North", "South", "East", "West", "Central"];
    for (const region of regions) {
      if (address.toLowerCase().includes(region.toLowerCase())) {
        return region;
      }
    }
    return "unknown";
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...orders];
      
      // Filter by region
      if (selectedRegion !== "all") {
        filtered = filtered.filter(order => {
          const orderRegion = order.region || extractRegionFromAddress(order.from_address);
          return orderRegion.toLowerCase() === selectedRegion.toLowerCase();
        });
      }
      
      // Filter by weight
      filtered = filtered.filter(order => order.weight <= maxWeight);
      
      setFilteredOrders(filtered);
    };
    
    applyFilters();
  }, [selectedRegion, maxWeight, orders]);

  return {
    filteredOrders,
    selectedRegion,
    setSelectedRegion,
    maxWeight,
    setMaxWeight
  };
};
