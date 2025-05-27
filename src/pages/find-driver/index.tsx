
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Clock, Package } from "lucide-react";
import Layout from "@/components/Layout";
import { useAddressBook } from "@/hooks/useAddressBook";
import { AddressBookDialog } from "@/components/address/AddressBookDialog";

const FindDriverPage = () => {
  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);
  const [addressType, setAddressType] = useState<'pickup' | 'delivery'>('pickup');
  const { addresses, loading, fetchAddresses } = useAddressBook();

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Fahrer finden
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickup">Abholort</Label>
                <div className="flex gap-2">
                  <Input id="pickup" placeholder="Abholadresse eingeben" className="flex-1" />
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
                <Label htmlFor="delivery">Zielort</Label>
                <div className="flex gap-2">
                  <Input id="delivery" placeholder="Lieferadresse eingeben" className="flex-1" />
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
                <Label htmlFor="date">Abholdatum</Label>
                <div className="flex gap-2">
                  <Input id="date" type="date" className="flex-1" />
                  <Calendar className="h-4 w-4 mt-3 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Uhrzeit</Label>
                <div className="flex gap-2">
                  <Input id="time" type="time" className="flex-1" />
                  <Clock className="h-4 w-4 mt-3 text-gray-400" />
                </div>
              </div>
            </div>

            <Button className="w-full" size="lg">
              Verfügbare Fahrer suchen
            </Button>
          </CardContent>
        </Card>

        <AddressBookDialog
          open={isAddressBookOpen}
          onClose={() => setIsAddressBookOpen(false)}
          onSelectAddress={handleSelectAddress}
          addressType={addressType}
        />
      </div>
    </Layout>
  );
};

export default FindDriverPage;
