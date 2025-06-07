
import { supabase } from '@/lib/supabaseClient';
import type { PublicMapItem } from '@/types/upload';

export const useFetchPublishedRides = () => {
  const fetchPublishedRides = async (): Promise<PublicMapItem[]> => {
    try {
      console.log('🔍 Fetching published rides...');

      const { data: ridesData, error: ridesError } = await supabase
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
        console.warn('⚠️ Rides loading failed:', ridesError.message);
        return [];
      }

      const rides = ridesData || [];
      console.log(`✅ Loaded ${rides.length} rides`);

      // Convert rides to PublicMapItem format
      return rides.map(ride => ({
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
    } catch (err) {
      console.warn('⚠️ Rides query failed:', err);
      return [];
    }
  };

  return { fetchPublishedRides };
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
