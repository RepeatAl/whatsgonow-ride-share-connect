
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { AddressBookDriverList } from "@/components/driver/AddressBookDriverList";
import { useAddressBook } from "@/hooks/useAddressBook";
import { AddressBookEntry } from "@/types/address";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface LocationState {
  fromNewOrder?: boolean;
  useAddressBook?: boolean;
}

const FindDriverPage = () => {
  const location = useLocation();
  const { getAddressBook } = useAddressBook();
  const { user, profile } = useAuth();
  const [drivers, setDrivers] = useState<AddressBookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const state = location.state as LocationState;
  const shouldUseAddressBook = !!state?.useAddressBook;
  
  // Check if user role is allowed to see this feature
  const isBusinessOrCM = profile?.role === 'sender_business' || profile?.role === 'cm';

  useEffect(() => {
    const loadDrivers = async () => {
      setIsLoading(true);
      try {
        // Get drivers from address book
        const addressBookEntries = await getAddressBook('driver');
        setDrivers(addressBookEntries);
      } catch (error) {
        console.error("Error loading drivers from address book:", error);
        toast.error("Fehler beim Laden der Fahrer aus dem Adressbuch");
      } finally {
        setIsLoading(false);
      }
    };

    if (shouldUseAddressBook && isBusinessOrCM) {
      loadDrivers();
    } else {
      setIsLoading(false);
    }
  }, [getAddressBook, shouldUseAddressBook, isBusinessOrCM]);

  // Mock function to send request to driver
  const sendDriverRequest = async (driver: AddressBookEntry) => {
    try {
      toast.success(`Anfrage wurde an ${driver.name || "den Fahrer"} gesendet`);
      // Here would be the actual implementation to send a request to the driver
      // For now, we just show a success message
    } catch (error) {
      console.error("Error sending driver request:", error);
      toast.error("Fehler beim Senden der Anfrage an den Fahrer");
    }
  };

  const renderContent = () => {
    // If user is not a business sender or community manager
    if (!isBusinessOrCM) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Funktion nicht verfügbar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Diese Funktion ist nur für Geschäftskunden und Community Manager verfügbar.
            </p>
          </CardContent>
        </Card>
      );
    }

    // If using address book drivers
    if (shouldUseAddressBook) {
      return (
        <AddressBookDriverList
          drivers={drivers}
          onSelect={sendDriverRequest}
          isLoading={isLoading}
        />
      );
    }

    // Default driver search view
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fahrer finden</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Hier können Sie alle verfügbaren Fahrer durchsuchen.
          </p>
          <div className="bg-muted p-4 rounded-md text-center">
            Fahrersuche-Formular (wird später implementiert)
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Zurück
          </Button>
          <h1 className="text-2xl font-bold">Fahrer finden</h1>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default FindDriverPage;
