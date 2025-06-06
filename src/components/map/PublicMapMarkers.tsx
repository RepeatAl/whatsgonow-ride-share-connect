
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import type { PublicMapItem } from '@/hooks/usePublicMapData';

interface PublicMapMarkersProps {
  mapInstance: any;
  uiInstance: any;
  mapData: PublicMapItem[];
  onMarkerClick?: (item: PublicMapItem) => void;
}

export const PublicMapMarkers: React.FC<PublicMapMarkersProps> = ({
  mapInstance,
  uiInstance,
  mapData,
  onMarkerClick
}) => {
  const { t } = useTranslation(['common', 'landing']);
  const { getLocalizedUrl } = useLanguageMCP();

  React.useEffect(() => {
    if (!mapInstance || !uiInstance || !window.H) return;

    // Entferne vorherige Marker
    const markersToRemove: any[] = [];
    mapInstance.getObjects().forEach((obj: any) => {
      if (obj instanceof window.H.map.Marker) {
        markersToRemove.push(obj);
      }
    });
    markersToRemove.forEach(marker => mapInstance.removeObject(marker));

    // Füge neue Marker hinzu
    mapData.forEach((item) => {
      const icon = createMarkerIcon(item.type, item.price);
      const marker = new window.H.map.Marker(
        { lat: item.lat, lng: item.lng },
        { icon }
      );

      // Click Event für InfoBubble
      marker.addEventListener('tap', (evt: any) => {
        // Schließe vorherige Bubbles
        uiInstance.getBubbles().forEach((bubble: any) => bubble.close());

        const bubble = new window.H.ui.InfoBubble(
          { lat: item.lat, lng: item.lng },
          {
            content: createInfoBubbleContent(item, t, getLocalizedUrl)
          }
        );

        uiInstance.addBubble(bubble);
        
        if (onMarkerClick) {
          onMarkerClick(item);
        }
      });

      mapInstance.addObject(marker);
    });

  }, [mapInstance, uiInstance, mapData, t, getLocalizedUrl, onMarkerClick]);

  return null; // Dieser Component rendert nichts direkt
};

// Unicode-safe base64 encoding function
const unicodeToBase64 = (str: string): string => {
  // First encode to UTF-8, then to base64
  return btoa(unescape(encodeURIComponent(str)));
};

// Erstelle Icon basierend auf Typ und Preis
const createMarkerIcon = (type: string, price?: number) => {
  const getColor = () => {
    if (!price) return '#6b7280'; // grau
    if (price < 15) return '#10b981'; // grün
    if (price < 25) return '#f59e0b'; // orange
    return '#ef4444'; // rot
  };

  const getSymbol = () => {
    switch (type) {
      case 'trip': return '🚗';
      case 'order': return '📦';
      case 'item': return '📦';
      case 'offer': return '💰';
      default: return '📍';
    }
  };

  const color = getColor();
  const symbol = getSymbol();

  const svgString = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="16" y="20" text-anchor="middle" fill="white" font-size="12">${symbol}</text>
      ${price ? `<text x="16" y="8" text-anchor="middle" fill="white" font-size="8">${price}€</text>` : ''}
    </svg>
  `;

  return new window.H.map.Icon(
    `data:image/svg+xml;base64,${unicodeToBase64(svgString)}`,
    { size: { w: 32, h: 32 } }
  );
};

// Erstelle InfoBubble Content
const createInfoBubbleContent = (
  item: PublicMapItem, 
  t: any, 
  getLocalizedUrl: (path: string) => string
) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const detailUrl = item.type === 'trip' 
    ? getLocalizedUrl(`/trip/${item.id}`)
    : getLocalizedUrl(`/order/${item.id}`);

  return `
    <div style="padding: 12px; max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="font-size: 16px;">${item.type === 'trip' ? '🚗' : '📦'}</span>
        <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #1f2937;">${item.title}</h4>
      </div>
      
      ${item.price ? `
        <div style="background: #f3f4f6; padding: 4px 8px; border-radius: 6px; margin-bottom: 8px; display: inline-block;">
          <span style="font-weight: 600; color: #059669;">${item.price}€</span>
        </div>
      ` : ''}
      
      ${item.from_address && item.to_address ? `
        <div style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">
          <div>${item.from_address}</div>
          <div style="margin: 2px 0;">↓</div>
          <div>${item.to_address}</div>
        </div>
      ` : ''}
      
      ${item.date ? `
        <div style="margin-bottom: 12px; font-size: 12px; color: #6b7280;">
          ${item.type === 'trip' ? t('common:departure') : t('common:deadline')}: ${formatDate(item.date)}
        </div>
      ` : ''}
      
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <button 
          onclick="window.open('${detailUrl}', '_blank')" 
          style="
            padding: 6px 12px; 
            background: #3b82f6; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            font-size: 12px; 
            cursor: pointer;
            font-weight: 500;
          "
        >
          ${t('common:view_details')}
        </button>
        
        <button 
          onclick="console.log('Contact for item:', '${item.id}')" 
          style="
            padding: 6px 12px; 
            background: #10b981; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            font-size: 12px; 
            cursor: pointer;
            font-weight: 500;
          "
        >
          ${item.type === 'trip' ? t('common:book_trip') : t('common:contact_sender')}
        </button>
      </div>
    </div>
  `;
};

export default PublicMapMarkers;
