
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Clock, Package, Truck, User } from "lucide-react";
import Layout from "@/components/Layout";
import { useAddressBook } from "@/hooks/useAddressBook";
import { AddressBookDialog } from "@/components/address/AddressBookDialog";
import AuthRequired from "@/components/auth/AuthRequired";
import { useTranslation } from "react-i18next";

const FindDriverPage = () => {
  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);
  const [addressType, setAddressType] = useState<'pickup' | 'delivery'>('pickup');
  const [showDriverList, setShowDriverList] = useState(false);
  const { addresses, loading, fetchAddresses } = useAddressBook();
  const { t } = useTranslation(['transport', 'auth', 'common']);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSelectAddress = (address: any) => {
    console.log('Selected address:', address);
    setIsAddressBookOpen(false);
  };

  const openAddressBook = (type: 'pickup' | 'delivery') => {
    setAddressType(type);
    setIsAddressBookOpen(true);
  };

  const handleSearch = () => {
    // Öffentliche Suche - kein Login erforderlich
    setShowDriverList(true);
  };

  const handleCreateRequest = () => {
    console.log('Creating transport request...');
    // Diese Funktion wird von AuthRequired gesteuert
  };

  const handleContactDriver = (driverId: string) => {
    console.log('Contacting driver:', driverId);
    // Diese Funktion wird von AuthRequired gesteuert
  };

  // Mock driver data für Demo
  const mockDrivers = [
    {
      id: "1",
      name: "Max Mustermann",
      rating: 4.8,
      vehicle: "Mercedes Sprinter",
      price: "€45",
      distance: "2.3 km entfernt",
      available: "Heute 14:00 - 18:00"
    },
    {
      id: "2", 
      name: "Anna Schmidt",
      rating: 4.9,
      vehicle: "VW Crafter",
      price: "€42",
      distance: "3.1 km entfernt",
      available: "Heute 15:00 - 20:00"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t('transport:find_driver', 'Fahrer finden')}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('transport:public_search_hint', 'Suche öffentlich verfügbare Fahrer. Für Anfragen ist eine Anmeldung erforderlich.')}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Öffentlicher Suchbereich */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickup">{t('transport:pickup_location', 'Abholort')}</Label>
                <div className="flex gap-2">
                  <Input id="pickup" placeholder={t('transport:pickup_placeholder', 'Abholadresse eingeben')} className="flex-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddressBook('pickup')}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery">{t('transport:delivery_location', 'Zielort')}</Label>
                <div className="flex gap-2">
                  <Input id="delivery" placeholder={t('transport:delivery_placeholder', 'Lieferadresse eingeben')} className="flex-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddressBook('delivery')}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">{t('transport:pickup_date', 'Abholdatum')}</Label>
                <div className="flex gap-2">
                  <Input id="date" type="date" className="flex-1" />
                  <Calendar className="h-4 w-4 mt-3 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">{t('transport:pickup_time', 'Uhrzeit')}</Label>
                <div className="flex gap-2">
                  <Input id="time" type="time" className="flex-1" />
                  <Clock className="h-4 w-4 mt-3 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Öffentliche Suche - kein Login erforderlich */}
            <Button onClick={handleSearch} className="w-full" size="lg">
              <Truck className="mr-2 h-4 w-4" />
              {t('transport:search_drivers', 'Verfügbare Fahrer suchen')}
            </Button>

            {/* Geschützter Bereich - Create Request Button */}
            <div className="pt-4 border-t">
              <AuthRequired 
                action="create_transport_request" 
                loginPrompt={t('auth:login_required_for_transport_request', 'Zum Erstellen einer Transportanfrage ist eine Anmeldung erforderlich.')}
                onAuthSuccess={handleCreateRequest}
              >
                <Button variant="accent" className="w-full" size="lg">
                  <Package className="mr-2 h-4 w-4" />
                  {t('transport:create_request', 'Transportanfrage erstellen')}
                </Button>
              </AuthRequired>
            </div>
          </CardContent>
        </Card>

        {/* Öffentliche Fahrer-Liste (Vorschau) */}
        {showDriverList && (
          <div className="max-w-2xl mx-auto mt-8 space-y-4">
            <h3 className="text-lg font-semibold">
              {t('transport:available_drivers', 'Verfügbare Fahrer')}
            </h3>
            
            {mockDrivers.map((driver) => (
              <Card key={driver.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{driver.name}</h4>
                      <p className="text-sm text-gray-600">{driver.vehicle}</p>
                      <p className="text-xs text-gray-500">{driver.distance} • {driver.available}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-lg font-bold text-green-600">{driver.price}</div>
                    <div className="text-sm text-yellow-600">⭐ {driver.rating}</div>
                    
                    {/* Geschützter Kontakt-Button */}
                    <AuthRequired 
                      action="contact_driver" 
                      loginPrompt={t('auth:login_required_for_contact', 'Zum Kontaktieren des Fahrers ist eine Anmeldung erforderlich.')}
                      onAuthSuccess={() => handleContactDriver(driver.id)}
                    >
                      <Button size="sm" variant="outline">
                        {t('transport:contact', 'Kontakt aufnehmen')}
                      </Button>
                    </AuthRequired>
                  </div>
                </div>
              </Card>
            ))}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 {t('transport:login_benefit', 'Nach der Anmeldung kannst du direkt mit Fahrern in Kontakt treten und Transportanfragen erstellen.')}
              </p>
            </div>
          </div>
        )}

        <AddressBookDialog
          open={isAddressBookOpen}
          onClose={() => setIsAddressBookOpen(false)}
          onSelect={handleSelectAddress}
        />
      </div>
    </Layout>
  );
};

export default FindDriverPage;
