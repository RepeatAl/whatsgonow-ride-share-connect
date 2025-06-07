
import type { PublicMapItem } from '@/types/upload';

// Mock-Daten für Demo-Zwecke
export const getMockMapData = (): PublicMapItem[] => {
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

// Mock-Funktion für Koordinaten basierend auf Adresse (zentral)
export const generateMockCoordinates = (address: string) => {
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

// Utility für das Kombinieren von Map-Items
export const combineMapItems = (...itemArrays: PublicMapItem[][]): PublicMapItem[] => {
  return itemArrays.flat();
};

// Check if map items are expired
export const filterActiveItems = (items: PublicMapItem[]): PublicMapItem[] => {
  const now = new Date();
  return items.filter(item => {
    if (item.expires_at) {
      return new Date(item.expires_at) > now;
    }
    if (item.date) {
      return new Date(item.date) > now;
    }
    return true; // Keep items without expiration
  });
};
