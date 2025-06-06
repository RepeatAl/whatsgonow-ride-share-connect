
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useTranslation } from 'react-i18next';

export interface PublicMapItem {
  id: string;
  type: 'trip' | 'item' | 'order' | 'offer';
  title: string;
  lat: number;
  lng: number;
  price?: number;
  date?: string;
  route_polyline?: string;
  category?: string;
  status: string;
  from_address?: string;
  to_address?: string;
  weight?: number;
  description?: string;
}

export const usePublicMapData = () => {
  const { t } = useTranslation(['common', 'landing']);
  const [mapData, setMapData] = useState<PublicMapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicMapData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lade öffentliche Bestellungen/Artikel
      const { data: orders, error: ordersError } = await supabase
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
          published_at
        `)
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .gte('deadline', new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(50);

      if (ordersError) {
        console.error('Error loading orders:', ordersError);
      }

      // Lade öffentliche Fahrten
      const { data: rides, error: ridesError } = await supabase
        .from('rides')
        .select(`
          id,
          description,
          start_address,
          end_address,
          departure_time,
          price_per_kg,
          status,
          vehicle_type,
          start_postal_code,
          end_postal_code
        `)
        .eq('status', 'published')
        .gte('departure_time', new Date().toISOString())
        .order('departure_time', { ascending: true })
        .limit(30);

      if (ridesError) {
        console.error('Error loading rides:', ridesError);
      }

      // Verarbeite Orders zu Map Items
      const orderItems: PublicMapItem[] = (orders || []).map(order => ({
        id: order.order_id,
        type: 'order' as const,
        title: order.item_name || order.description || t('common:order'),
        lat: generateMockCoordinates(order.from_address).lat,
        lng: generateMockCoordinates(order.from_address).lng,
        price: order.price,
        date: order.deadline,
        category: order.category,
        status: order.status,
        from_address: order.from_address,
        to_address: order.to_address,
        weight: order.weight,
        description: order.description
      }));

      // Verarbeite Rides zu Map Items
      const rideItems: PublicMapItem[] = (rides || []).map(ride => ({
        id: ride.id,
        type: 'trip' as const,
        title: ride.description || `${ride.start_address} → ${ride.end_address}`,
        lat: generateMockCoordinates(ride.start_address).lat,
        lng: generateMockCoordinates(ride.start_address).lng,
        price: ride.price_per_kg,
        date: ride.departure_time,
        status: ride.status,
        from_address: ride.start_address,
        to_address: ride.end_address,
        description: ride.description
      }));

      // Kombiniere alle Items
      setMapData([...orderItems, ...rideItems]);

    } catch (err) {
      console.error('Error fetching public map data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Mock-Funktion für Koordinaten basierend auf Adresse
  // In Produktion: Geocoding Service verwenden
  const generateMockCoordinates = (address: string) => {
    const hash = address ? address.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0) : 0;
    
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
