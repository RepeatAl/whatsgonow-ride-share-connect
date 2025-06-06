
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface FeatureStatus {
  modularLoader: boolean;
  eventSystem: boolean;
  uiControls: boolean;
  trafficLayer: boolean;
  markerInteraction: boolean;
  geocoding: boolean;
  routing: boolean;
  routeRendering: boolean;
  responsive: boolean;
  fallback: boolean;
  languageAware: boolean;
  performance: boolean;
}

interface HereMapFeatureStatusProps {
  featureStatus: FeatureStatus;
  className?: string;
}

const FEATURE_DESCRIPTIONS = {
  modularLoader: {
    name: 'Modularer Loader',
    description: 'Core, Service, UI, MapEvents Module geladen',
    critical: true
  },
  eventSystem: {
    name: 'Event-System',
    description: 'Drag, Tap, Zoom mit H.mapevents.Behavior',
    critical: true
  },
  uiControls: {
    name: 'UI Controls',
    description: 'H.ui.UI.createDefault() aktiviert',
    critical: true
  },
  trafficLayer: {
    name: 'Traffic Layer',
    description: 'Live Traffic via trafficincidents Layer',
    critical: false
  },
  markerInteraction: {
    name: 'Marker-Interaktion',
    description: 'Klick auf Marker zeigt InfoBubble',
    critical: true
  },
  geocoding: {
    name: 'Geocoding Service',
    description: 'Adresssuche mit platform.getSearchService()',
    critical: false
  },
  routing: {
    name: 'Routing Service',
    description: 'platform.getRoutingService() + Waypoints',
    critical: false
  },
  routeRendering: {
    name: 'Route-Rendering',
    description: 'Linienzeichnung per H.map.Polyline()',
    critical: false
  },
  responsive: {
    name: 'Responsive Design',
    description: 'Mobile/Desktop Verhalten getestet',
    critical: true
  },
  fallback: {
    name: 'Fallback bei Fehlern',
    description: 'MapFallback bei Fehlschlag angezeigt',
    critical: true
  },
  languageAware: {
    name: 'Language Awareness',
    description: 'Karte reagiert auf i18n Sprachwechsel',
    critical: false
  },
  performance: {
    name: 'Performance',
    description: 'Keine mehrfachen H.Map-Initialisierungen',
    critical: true
  }
};

const HereMapFeatureStatus: React.FC<HereMapFeatureStatusProps> = ({
  featureStatus,
  className = ''
}) => {
  const completedFeatures = Object.values(featureStatus).filter(Boolean).length;
  const totalFeatures = Object.keys(featureStatus).length;
  const criticalFeatures = Object.entries(FEATURE_DESCRIPTIONS)
    .filter(([_, desc]) => desc.critical)
    .map(([key, _]) => key);
  const completedCritical = criticalFeatures.filter(key => featureStatus[key as keyof FeatureStatus]).length;

  const getStatusIcon = (status: boolean, critical: boolean) => {
    if (status) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (critical) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: boolean, critical: boolean) => {
    if (status) {
      return <Badge variant="default" className="bg-green-100 text-green-800">✅ Aktiv</Badge>;
    } else if (critical) {
      return <Badge variant="destructive">❌ Fehlt</Badge>;
    } else {
      return <Badge variant="secondary">⚠️ Optional</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>HERE Maps Feature Status</span>
          <div className="text-sm font-normal">
            <Badge variant="outline">
              {completedFeatures}/{totalFeatures} Features
            </Badge>
            <Badge variant="outline" className="ml-2">
              {completedCritical}/{criticalFeatures.length} Kritisch
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(FEATURE_DESCRIPTIONS).map(([key, desc]) => {
            const status = featureStatus[key as keyof FeatureStatus];
            
            return (
              <div
                key={key}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  status ? 'bg-green-50 border-green-200' : 
                  desc.critical ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(status, desc.critical)}
                  <div>
                    <div className="font-medium text-sm">{desc.name}</div>
                    <div className="text-xs text-gray-600">{desc.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {desc.critical && (
                    <Badge variant="outline" className="text-xs">
                      KRITISCH
                    </Badge>
                  )}
                  {getStatusBadge(status, desc.critical)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">📋 Produktionsreife Checkliste</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>✅ Modular Loading: Keine Bundle-Abhängigkeiten</div>
            <div>✅ Interactive Events: Pan, Zoom, Tap funktionsfähig</div>
            <div>✅ UI Components: Standard Controls & InfoBubbles</div>
            <div>✅ Advanced Services: Traffic, Routing, Geocoding verfügbar</div>
            <div>✅ Mobile-Ready: Responsive Design implementiert</div>
            <div>✅ Error Handling: Graceful Fallbacks bei API-Fehlern</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HereMapFeatureStatus;
