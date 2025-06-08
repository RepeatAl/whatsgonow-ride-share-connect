
import React from 'react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Euro, 
  Calendar,
  Package,
  Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

// Mock data - später durch echte API-Calls ersetzen
const mockRides = [
  {
    id: '1',
    status: 'active',
    title: 'Transport nach Berlin',
    fromAddress: 'München Hauptbahnhof',
    toAddress: 'Berlin Alexanderplatz',
    departureTime: '2024-01-15T14:30:00',
    arrivalTime: '2024-01-15T18:45:00',
    price: 89.50,
    items: ['Elektronik', 'Bücher'],
    weight: '15 kg',
    vehicleType: 'PKW'
  },
  {
    id: '2',
    status: 'completed',
    title: 'Möbeltransport',
    fromAddress: 'Hamburg Altstadt',
    toAddress: 'Bremen Zentrum',
    departureTime: '2024-01-12T09:00:00',
    arrivalTime: '2024-01-12T10:30:00',
    price: 125.00,
    items: ['Möbel', 'Hausrat'],
    weight: '45 kg',
    vehicleType: 'Transporter'
  },
  {
    id: '3',
    status: 'pending',
    title: 'Express-Lieferung',
    fromAddress: 'Frankfurt Innenstadt',
    toAddress: 'Mannheim',
    departureTime: '2024-01-16T16:00:00',
    arrivalTime: '2024-01-16T17:00:00',
    price: 45.00,
    items: ['Dokumente'],
    weight: '2 kg',
    vehicleType: 'PKW'
  }
];

const MyRides = () => {
  const { profile } = useOptimizedAuth();
  const { getLocalizedUrl } = useLanguageMCP();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-500">Aktiv</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Abgeschlossen</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500">Ausstehend</Badge>;
      default:
        return <Badge variant="outline">Unbekannt</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  if (!profile || profile.role !== 'driver') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Zugriff verweigert</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Diese Seite ist nur für Fahrer zugänglich.</p>
            <div className="mt-4">
              <Link to={getLocalizedUrl('/dashboard')}>
                <Button>Zurück zum Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meine Fahrten</h1>
        <p className="text-muted-foreground">
          Übersicht über alle deine Transportaufträge und Fahrten.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Truck className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <p className="text-sm text-muted-foreground">Aktive Fahrten</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">12</span>
            </div>
            <p className="text-sm text-muted-foreground">Abgeschlossen</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Euro className="h-5 w-5 text-emerald-500" />
              <span className="text-2xl font-bold text-emerald-600">€1,245</span>
            </div>
            <p className="text-sm text-muted-foreground">Gesamtverdienst</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">4.8</span>
            </div>
            <p className="text-sm text-muted-foreground">⭐ Bewertung</p>
          </CardContent>
        </Card>
      </div>

      {/* Rides List */}
      <div className="space-y-4">
        {mockRides.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Noch keine Fahrten</h3>
              <p className="text-muted-foreground mb-4">
                Du hast noch keine Transportaufträge angenommen. Starte jetzt und finde verfügbare Aufträge!
              </p>
              <Link to={getLocalizedUrl('/dashboard')}>
                <Button>
                  <MapPin className="h-4 w-4 mr-2" />
                  Verfügbare Aufträge finden
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          mockRides.map((ride) => {
            const departure = formatDateTime(ride.departureTime);
            const arrival = formatDateTime(ride.arrivalTime);
            
            return (
              <Card key={ride.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{ride.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(ride.status)}
                        <Badge variant="outline">{ride.vehicleType}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">€{ride.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{ride.weight}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          <span className="font-medium">Von:</span> {ride.fromAddress}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-red-500" />
                        <span className="text-sm">
                          <span className="font-medium">Nach:</span> {ride.toAddress}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">
                          <span className="font-medium">Abfahrt:</span> {departure.date} um {departure.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">
                          <span className="font-medium">Ankunft:</span> {arrival.date} um {arrival.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {ride.items.join(', ')}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {ride.status === 'active' && (
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4 mr-1" />
                          Route anzeigen
                        </Button>
                      )}
                      <Button size="sm">
                        Details anzeigen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 justify-center">
        <Link to={getLocalizedUrl('/dashboard')}>
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Neue Aufträge suchen
          </Button>
        </Link>
        <Link to={getLocalizedUrl('/profile')}>
          <Button variant="outline">
            <Truck className="h-4 w-4 mr-2" />
            Fahrzeug verwalten
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MyRides;
