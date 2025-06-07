
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import type { PublicMapItem, GuestUploadSession } from '@/types/upload';

export { type PublicMapItem } from '@/types/upload';

export const usePublicMapData = () => {
  const { t } = useTranslation(['common', 'landing']);
  const [mapData, setMapData] = useState<PublicMapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicMapData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching public map data...');

      // FIXED: Entferne Profile-Abhängigkeiten und lade nur öffentliche Daten
      // Try to load orders first (without profile dependencies)
      let orders: any[] = [];
      try {
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
          // Continue without orders instead of failing completely
        } else {
          orders = ordersData || [];
          console.log(`✅ Loaded ${orders.length} orders`);
        }
      } catch (err) {
        console.warn('⚠️ Orders query failed, continuing without orders:', err);
      }

      // Try to load rides
      let rides: any[] = [];
      try {
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
          // Continue without rides
        } else {
          rides = ridesData || [];
          console.log(`✅ Loaded ${rides.length} rides`);
        }
      } catch (err) {
        console.warn('⚠️ Rides query failed, continuing without rides:', err);
      }

      // NEW: Load guest uploads with location consent
      let guestUploads: GuestUploadSession[] = [];
      try {
        const { data: guestData, error: guestError } = await supabase
          .from('guest_upload_sessions')
          .select(`
            id,
            session_id,
            lat,
            lng,
            accuracy,
            location_consent,
            location_captured_at,
            expires_at,
            created_at,
            file_count,
            migrated_to_user_id,
            migrated_at
          `)
          .eq('location_consent', true)
          .not('lat', 'is', null)
          .not('lng', 'is', null)
          .gt('expires_at', new Date().toISOString())
          .is('migrated_to_user_id', null)
          .order('created_at', { ascending: false })
          .limit(20);

        if (guestError) {
          console.warn('⚠️ Guest uploads loading failed:', guestError.message);
        } else {
          guestUploads = guestData || [];
          console.log(`✅ Loaded ${guestUploads.length} guest uploads with location`);
        }
      } catch (err) {
        console.warn('⚠️ Guest uploads query failed, continuing without guest data:', err);
      }

      // FALLBACK: Wenn keine echten Daten, verwende Mock-Daten für Demo
      if (orders.length === 0 && rides.length === 0 && guestUploads.length === 0) {
        console.log('📝 Using mock data for demo purposes');
        setMapData(getMockMapData());
        return;
      }

      // Verarbeite Orders zu Map Items
      const orderItems: PublicMapItem[] = orders.map(order => ({
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

      // Verarbeite Rides zu Map Items
      const rideItems: PublicMapItem[] = rides.map(ride => ({
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

      // NEW: Verarbeite Guest Uploads zu Map Items
      const guestItems: PublicMapItem[] = guestUploads
        .filter(guest => guest.lat && guest.lng)
        .map(guest => ({
          id: guest.session_id,
          type: 'guest' as const,
          title: t('common:guest_upload', 'Gast-Upload'),
          lat: guest.lat!,
          lng: guest.lng!,
          status: 'active',
          expires_at: guest.expires_at,
          session_id: guest.session_id,
          file_count: guest.file_count,
          description: t('common:guest_upload_description', '{{count}} Datei(en) hochgeladen', { count: guest.file_count })
        }));

      // Kombiniere alle Items
      const allItems = [...orderItems, ...rideItems, ...guestItems];
      setMapData(allItems);
      console.log(`✅ Successfully loaded ${allItems.length} map items (${guestItems.length} guest uploads)`);

    } catch (err) {
      console.error('❌ Error fetching public map data:', err);
      
      // FALLBACK: Bei Fehler zeige Mock-Daten
      console.log('📝 Fallback to mock data due to error');
      setMapData(getMockMapData());
      setError(null); // Keine Fehler-UI, da Mock-Daten verwendet werden
    } finally {
      setLoading(false);
    }
  };

  // Mock-Daten für Demo-Zwecke
  const getMockMapData = (): PublicMapItem[] => {
    return [
      {
        id: 'mock-order-1',
        type: 'order',
        title: 'Umzugskartons Berlin → München',
        lat: 52.5200,
        lng: 13.4050,
        price: 45,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'published',
        from_address: 'Berlin, Mitte',
        to_address: 'München, Zentrum',
        weight: 25,
        description: '5 Umzugskartons, sorgfältig zu transportieren'
      },
      {
        id: 'mock-trip-1',
        type: 'trip',
        title: 'Hamburg → Frankfurt',
        lat: 53.5511,
        lng: 9.9937,
        price: 12,
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'published',
        from_address: 'Hamburg, Hauptbahnhof',
        to_address: 'Frankfurt am Main',
        description: 'Mitfahrgelegenheit mit Transportkapazität'
      },
      {
        id: 'mock-guest-1',
        type: 'guest',
        title: 'Gast-Upload',
        lat: 50.9375,
        lng: 6.9603,
        status: 'active',
        expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        session_id: 'mock-session',
        file_count: 2,
        description: '2 Datei(en) hochgeladen'
      }
    ];
  };

  // Mock-Funktion für Koordinaten basierend auf Adresse
  const generateMockCoordinates = (address: string) => {
    if (!address) {
      // Default: Berlin
      return { lat: 52.5200, lng: 13.4050 };
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
