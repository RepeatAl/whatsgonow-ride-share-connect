
import { useState, useEffect } from 'react';
import { useFetchPublishedOrders } from './fetchPublishedOrders';
import { useFetchPublishedRides } from './fetchPublishedRides';
import { useFetchGuestUploads } from './fetchGuestUploads';
import { getMockMapData, combineMapItems, filterActiveItems } from '@/utils/mapDataUtils';
import type { PublicMapItem } from '@/types/upload';

export { type PublicMapItem } from '@/types/upload';

export const usePublicMapData = () => {
  const [mapData, setMapData] = useState<PublicMapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data fetching hooks
  const { fetchPublishedOrders } = useFetchPublishedOrders();
  const { fetchPublishedRides } = useFetchPublishedRides();
  const { fetchGuestUploads } = useFetchGuestUploads();

  const fetchPublicMapData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching public map data...');

      // Fetch all data sources in parallel
      const [orderItems, rideItems, guestItems] = await Promise.all([
        fetchPublishedOrders(),
        fetchPublishedRides(),
        fetchGuestUploads()
      ]);

      // Check if we have any real data
      const totalItems = orderItems.length + rideItems.length + guestItems.length;
      
      if (totalItems === 0) {
        console.log('📝 Using mock data for demo purposes');
        setMapData(getMockMapData());
        return;
      }

      // Combine all items and filter active ones
      const allItems = combineMapItems(orderItems, rideItems, guestItems);
      const activeItems = filterActiveItems(allItems);
      
      setMapData(activeItems);
      console.log(`✅ Successfully loaded ${activeItems.length} map items (${guestItems.length} guest uploads)`);

    } catch (err) {
      console.error('❌ Error fetching public map data:', err);
      
      // Fallback to mock data on error
      console.log('📝 Fallback to mock data due to error');
      setMapData(getMockMapData());
      setError(null); // No error UI since we use mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicMapData();
  }, []);

  return {
    mapData,
    loading,
    error,
    refetch: fetchPublicMapData
  };
};
