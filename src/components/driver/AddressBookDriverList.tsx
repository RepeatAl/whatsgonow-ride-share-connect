
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Loader2, Users } from "lucide-react";
import type { AddressBookEntry } from "@/types/address";

interface AddressBookDriverListProps {
  drivers: AddressBookEntry[];
  onSelect: (driver: AddressBookEntry) => void;
  isLoading?: boolean;
}

export function AddressBookDriverList({ drivers, onSelect, isLoading = false }: AddressBookDriverListProps) {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDriverSelect = (id: string) => {
    setSelectedDriverId(id);
  };

  const handleSendRequest = () => {
    if (selectedDriverId) {
      const selectedDriver = drivers.find(driver => driver.id === selectedDriverId);
      if (selectedDriver) {
        onSelect(selectedDriver);
      }
    }
  };

  const handleFindMoreDrivers = () => {
    navigate("/find-driver/all");
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center items-center min-h-60">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (drivers.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Keine Fahrer gefunden</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground mb-6">
            Es wurden keine Fahrer in Ihrem Adressbuch gefunden.
          </p>
          <Button onClick={handleFindMoreDrivers}>Fahrer suchen</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fahrer aus Ihrem Adressbuch</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedDriverId || ""} onValueChange={handleDriverSelect}>
          {drivers.map(driver => (
            <div key={driver.id} className="flex items-center space-x-2 border p-4 rounded-md mb-2 hover:bg-accent cursor-pointer">
              <RadioGroupItem value={driver.id || ""} id={`driver-${driver.id}`} />
              <Label htmlFor={`driver-${driver.id}`} className="flex-grow cursor-pointer">
                <div className="ml-2">
                  <p className="font-medium">{driver.name || "Unbekannter Fahrer"}</p>
                  {driver.company_name && <p className="text-sm text-muted-foreground">{driver.company_name}</p>}
                  <p className="text-sm text-muted-foreground">
                    {driver.postal_code} {driver.city}, {driver.country}
                  </p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <Button 
          onClick={handleSendRequest} 
          disabled={!selectedDriverId}
          variant="brand"
          className="w-full sm:w-auto"
        >
          Anfrage an Fahrer senden
        </Button>
        <Button 
          onClick={handleFindMoreDrivers}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Weitere Fahrer finden
        </Button>
      </CardFooter>
    </Card>
  );
}
