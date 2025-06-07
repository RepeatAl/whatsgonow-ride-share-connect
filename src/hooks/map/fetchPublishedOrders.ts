
import { supabase } from '@/lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import type { PublicMapItem } from '@/types/upload';

export const useFetchPublishedOrders = () => {
  const { t } = useTranslation(['common']);

  const fetchPublishedOrders = async (): Promise<PublicMapItem[]> => {
    try {
      console.log('🔍 Fetching published orders...');

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          order_id,
          description,
          from_address,
          to_address,
          weight,
          price,
          deadline,
          status,
          item_name,
          category,
          published_at,
          lat,
          lng
        `)
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .gte('deadline', new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(50);

      if (ordersError) {
        console.warn('⚠️ Orders loading failed:', ordersError.message);
        return [];
      }

      const orders = ordersData || [];
      console.log(`✅ Loaded ${orders.length} orders`);

      // Convert orders to PublicMapItem format
      return orders.map(order => ({
        id: order.order_id,
        type: 'order' as const,
        title: order.item_name || order.description || t('common:order'),
        lat: order.lat || generateMockCoordinates(order.from_address).lat,
        lng: order.lng || generateMockCoordinates(order.from_address).lng,
        price: order.price,
        date: order.deadline,
        category: order.category,
        status: order.status,
        from_address: order.from_address,
        to_address: order.to_address,
        weight: order.weight,
        description: order.description
      }));
    } catch (err) {
      console.warn('⚠️ Orders query failed:', err);
      return [];
    }
  };

  return { fetchPublishedOrders };
};

// Mock-Funktion für Koordinaten basierend auf Adresse
const generateMockCoordinates = (address: string) => {
  if (!address) {
    return { lat: 52.5200, lng: 13.4050 }; // Default: Berlin
  }
  
  const hash = address.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Deutschland Koordinaten-Bereich
  const baseLatDE = 47.3; // Süden
  const baseLatRange = 7.6; // Nord-Süd Spanne
  const baseLngDE = 5.9; // Westen  
  const baseLngRange = 10.2; // Ost-West Spanne
  
  return {
    lat: baseLatDE + (Math.abs(hash % 1000) / 1000) * baseLatRange,
    lng: baseLngDE + (Math.abs((hash * 7) % 1000) / 1000) * baseLngRange
  };
};
