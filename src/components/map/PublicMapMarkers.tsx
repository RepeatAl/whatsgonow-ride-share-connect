
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import type { PublicMapItem } from '@/types/upload';

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
  const { t } = useTranslation(['common', 'landing', 'map', 'upload']);
  const { getLocalizedUrl } = useLanguageMCP();

  React.useEffect(() => {
    if (!mapInstance || !uiInstance || !window.H) return;

    console.log('🗺️ Updating map markers:', mapData.length, 'items');

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
      try {
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
      } catch (error) {
        console.warn('⚠️ Failed to create marker for item:', item.id, error);
      }
    });

    console.log('✅ Map markers updated successfully');

  }, [mapInstance, uiInstance, mapData, t, getLocalizedUrl, onMarkerClick]);

  return null; // Dieser Component rendert nichts direkt
};

// Robuste base64 encoding function für Unicode
const safeBase64Encode = (str: string): string => {
  try {
    // Sichere UTF-8 zu Base64 Konvertierung
    const utf8Bytes = new TextEncoder().encode(str);
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
  } catch (error) {
    console.warn('⚠️ Base64 encoding failed, using fallback:', error);
    // Fallback: Einfache ASCII-Zeichen
    return btoa(str.replace(/[^\x00-\x7F]/g, '?'));
  }
};

// Erstelle Icon basierend auf Typ und Preis mit stabilem Unicode-Rendering
const createMarkerIcon = (type: string, price?: number) => {
  const getColor = () => {
    if (type === 'guest') return '#9ca3af'; // grau für Gast-Uploads
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
      case 'guest': return '⏰'; // Uhr-Symbol für temporäre Uploads
      default: return '📍';
    }
  };

  const color = getColor();
  const symbol = getSymbol();

  // Optimiertes SVG mit besserer Unicode-Unterstützung
  const svgString = `
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2" opacity="${type === 'guest' ? '0.7' : '1'}"/>
      <circle cx="18" cy="18" r="14" fill="${color}" opacity="${type === 'guest' ? '0.6' : '0.9'}"/>
      <text x="18" y="23" text-anchor="middle" fill="white" font-size="14" font-family="system-ui, -apple-system, sans-serif">${symbol}</text>
      ${price ? `<text x="18" y="10" text-anchor="middle" fill="white" font-size="8" font-weight="bold">${price}€</text>` : ''}
      ${type === 'guest' ? `<circle cx="28" cy="8" r="6" fill="#f59e0b" opacity="0.9"/>` : ''}
    </svg>
  `;

  try {
    return new window.H.map.Icon(
      `data:image/svg+xml;base64,${safeBase64Encode(svgString)}`,
      { size: { w: 36, h: 36 } }
    );
  } catch (error) {
    console.warn('⚠️ Icon creation failed, using fallback:', error);
    // Fallback: Einfaches Icon ohne Emoji
    const fallbackSvg = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2" opacity="${type === 'guest' ? '0.7' : '1'}"/>
        <circle cx="12" cy="12" r="3" fill="white"/>
      </svg>
    `;
    return new window.H.map.Icon(
      `data:image/svg+xml;base64,${safeBase64Encode(fallbackSvg)}`,
      { size: { w: 24, h: 24 } }
    );
  }
};

// Erstelle InfoBubble Content mit verbesserter Mehrsprachigkeit
const createInfoBubbleContent = (
  item: PublicMapItem, 
  t: any, 
  getLocalizedUrl: (path: string) => string
) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTimeLeft = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const hoursLeft = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursLeft < 1) return t('upload:expires_soon', 'Läuft bald ab');
    if (hoursLeft < 24) return t('upload:expires_hours', '{{hours}}h verbleibend', { hours: hoursLeft });
    
    const daysLeft = Math.floor(hoursLeft / 24);
    return t('upload:expires_days', '{{days}} Tage verbleibend', { days: daysLeft });
  };

  // Spezial-Behandlung für Guest-Uploads
  if (item.type === 'guest') {
    return `
      <div style="padding: 12px; max-width: 300px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.4;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 18px;">⏰</span>
          <h4 style="margin: 0; font-size: 15px; font-weight: 600; color: #1f2937;">${item.title}</h4>
        </div>
        
        <div style="font-size: 11px; color: #9ca3af; margin-bottom: 8px;">
          ${t('upload:temporary', 'Temporär')}
        </div>
        
        <div style="background: #f3f4f6; padding: 6px 10px; border-radius: 6px; margin-bottom: 10px; display: inline-block;">
          <span style="font-weight: 600; color: #f59e0b; font-size: 12px;">${formatTimeLeft(item.expires_at!)}</span>
        </div>
        
        ${item.file_count ? `
          <div style="margin-bottom: 10px; font-size: 12px; color: #6b7280; background: #f9fafb; padding: 8px; border-radius: 4px;">
            <div style="margin-top: 4px;">${t('upload:files_uploaded', '{{count}} Datei(en) hochgeladen', { count: item.file_count })}</div>
          </div>
        ` : ''}
        
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <button 
            onclick="console.log('Guest upload info:', '${item.session_id}')" 
            style="
              padding: 8px 12px; 
              background: #9ca3af; 
              color: white; 
              border: none; 
              border-radius: 6px; 
              font-size: 12px; 
              cursor: pointer;
              font-weight: 500;
              flex: 1;
            "
          >
            ${t('upload:guest_mode_title', 'Gast-Upload-Modus')}
          </button>
        </div>
        
        <div style="margin-top: 8px; font-size: 10px; color: #9ca3af; text-align: center;">
          ${t('upload:login_to_save', 'Melden Sie sich an, um Ihre Bilder dauerhaft zu speichern.')}
        </div>
      </div>
    `;
  }

  // Standard-Behandlung für andere Marker-Typen
  const detailUrl = item.type === 'trip' 
    ? getLocalizedUrl(`/trip/${item.id}`)
    : getLocalizedUrl(`/order/${item.id}`);

  const typeIcon = item.type === 'trip' ? '🚗' : '📦';
  const typeLabel = item.type === 'trip' 
    ? t('map:trip_type', 'Fahrt') 
    : t('map:order_type', 'Auftrag');

  return `
    <div style="padding: 12px; max-width: 300px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.4;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="font-size: 18px;">${typeIcon}</span>
        <h4 style="margin: 0; font-size: 15px; font-weight: 600; color: #1f2937;">${item.title}</h4>
      </div>
      
      <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">
        ${typeLabel}
      </div>
      
      ${item.price ? `
        <div style="background: #f3f4f6; padding: 6px 10px; border-radius: 6px; margin-bottom: 10px; display: inline-block;">
          <span style="font-weight: 600; color: #059669; font-size: 14px;">${item.price}€</span>
        </div>
      ` : ''}
      
      ${item.from_address && item.to_address ? `
        <div style="margin-bottom: 10px; font-size: 12px; color: #6b7280; background: #f9fafb; padding: 8px; border-radius: 4px;">
          <div style="font-weight: 500;">${t('map:route', 'Route')}:</div>
          <div style="margin-top: 4px;">${item.from_address}</div>
          <div style="margin: 4px 0; text-align: center;">↓</div>
          <div>${item.to_address}</div>
        </div>
      ` : ''}
      
      ${item.date ? `
        <div style="margin-bottom: 12px; font-size: 12px; color: #6b7280;">
          <strong>${item.type === 'trip' ? t('common:departure') : t('common:deadline')}:</strong> ${formatDate(item.date)}
        </div>
      ` : ''}
      
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <button 
          onclick="window.open('${detailUrl}', '_blank')" 
          style="
            padding: 8px 12px; 
            background: #3b82f6; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            font-size: 12px; 
            cursor: pointer;
            font-weight: 500;
            flex: 1;
          "
        >
          ${t('common:view_details', 'Details ansehen')}
        </button>
        
        <button 
          onclick="console.log('Contact for item:', '${item.id}')" 
          style="
            padding: 8px 12px; 
            background: #10b981; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            font-size: 12px; 
            cursor: pointer;
            font-weight: 500;
            flex: 1;
          "
        >
          ${item.type === 'trip' ? t('common:book_trip', 'Buchen') : t('common:contact_sender', 'Kontakt')}
        </button>
      </div>
    </div>
  `;
};

export default PublicMapMarkers;
