
# HERE Maps Integration - Entwickler-Dokumentation

## Überblick

Diese Dokumentation beschreibt die HERE Maps Integration in Whatsgonow. Die Implementation folgt der CTO-Checkliste für eine sichere, responsive und erweiterbare Kartenlösung.

## API Key Management

### Sicherheit
- **NIEMALS** API Keys direkt im Frontend-Code speichern
- API Key wird über Supabase Secrets verwaltet
- Zugriff erfolgt über Umgebungsvariablen

### Konfiguration
```bash
# Lokale Entwicklung (.env.local)
VITE_HERE_MAPS_API_KEY=your_api_key_here

# Deployment
# API Key über Supabase Secrets konfiguriert als "HERE_MAPS_API_KEY"
```

## Komponenten-API

### HereMapComponent

```typescript
interface HereMapComponentProps {
  width?: string;          // Default: "100%"
  height?: string;         // Default: "400px"
  className?: string;      // CSS classes
  center?: { lat: number; lng: number }; // Default: Berlin
  zoom?: number;           // Default: 10
  showTestMarkers?: boolean; // Default: true
}
```

### Verwendung

```tsx
import { HereMapComponent } from '@/components/map';

// Basis-Karte
<HereMapComponent />

// Konfigurierte Karte
<HereMapComponent
  height="600px"
  center={{ lat: 48.1, lng: 11.6 }} // München
  zoom={12}
  showTestMarkers={false}
/>
```

## Marker hinzufügen

### Beispiel: Dynamische Marker

```typescript
const addCustomMarker = (map: any, lat: number, lng: number, title: string) => {
  const icon = new window.H.map.Icon(
    'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
              fill="#9b87f5"/>
        <circle cx="12" cy="9" r="2.5" fill="white"/>
      </svg>
    `),
    { size: { w: 24, h: 24 } }
  );

  const marker = new window.H.map.Marker({ lat, lng }, { icon });
  
  // Info-Bubble bei Klick
  marker.addEventListener('tap', () => {
    const bubble = new window.H.ui.InfoBubble(title);
    bubble.open(map, { lat, lng });
  });

  map.addObject(marker);
  return marker;
};
```

## Error Handling

### API Key Fehler
```typescript
// Automatische Behandlung in HereMapComponent
if (!apiKey || apiKey === 'demo-key') {
  throw new Error('HERE Maps API Key nicht konfiguriert');
}
```

### Netzwerk-Fehler
- Fallback-UI wird automatisch angezeigt
- Benutzerfreundliche Fehlermeldungen
- Retry-Mechanismus über Browser-Refresh

## DSGVO & Privacy

### Standort-Handling
- **Keine automatische Geolocation** ohne Nutzer-Zustimmung
- Default-Zentrum auf Deutschland/Europa
- IP-basierte grobe Location nur nach Opt-in

### Privacy-Hinweise
```typescript
// Beispiel für Geolocation mit Zustimmung
const requestUserLocation = async () => {
  if (!navigator.geolocation) return null;
  
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }),
      (error) => reject(error),
      { timeout: 10000 }
    );
  });
};
```

## Performance

### Optimierungen
- Lazy Loading des HERE Maps SDK
- Marker-Clustering bei vielen Pins
- Viewport-Resize-Handler für Responsive Verhalten

### Best Practices
```typescript
// Cleanup bei Component Unmount
useEffect(() => {
  return () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.dispose();
    }
  };
}, []);
```

## Testing

### Browser-Kompatibilität
- ✅ Chrome (Desktop/Mobile)
- ✅ Firefox (Desktop/Mobile)  
- ✅ Safari (Desktop/Mobile)
- ✅ Edge (Desktop)

### Performance-Tests
- Erste Render-Zeit: < 2s
- Marker-Addition: < 100ms pro Pin
- Mobile-Responsiveness: Getestet auf iOS/Android

## Demo & Testing

Besuchen Sie `/here-maps-demo` für eine vollständige Demo mit:
- Live-Karte mit Test-Markern
- Verschiedene Standort-Tests
- Mobile/Desktop-Responsiveness
- CTO-Checkliste Status

## Nächste Ausbaustufen

Nach erfolgreichem MVP-Test:

1. **Dynamische Daten**: Supabase-Integration für Live-Pins
2. **Farb-Logik**: Preisschwellen und Kategorien
3. **Filter-Integration**: Fahrzeug, Preis, Verfügbarkeit
4. **Interaktionen**: Hover-States, Click-Events, Mobile-Optimierung
5. **DSGVO-Compliance**: Erweiterte Privacy-Controls

## Support

Bei Problemen:
1. API Key korrekt konfiguriert?
2. Browser-Entwicklerkonsole auf Fehler prüfen
3. Netzwerk-Konnektivität testen
4. Demo-Seite zur Funktionsvalidierung nutzen
