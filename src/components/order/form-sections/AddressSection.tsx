
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/validators/order";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface AddressSectionProps {
  form: UseFormReturn<CreateOrderFormValues>;
  type: 'pickup' | 'delivery';
}

export const AddressSection = ({ form, type }: AddressSectionProps) => {
  const prefix = type === 'pickup' ? 'pickup' : 'delivery';
  const title = type === 'pickup' ? 'Abholadresse' : 'Zieladresse';
  const { profile } = useAuth();
  const [showAddressBook, setShowAddressBook] = useState(false);

  // Funktion zum Öffnen des Adressbuch-Dialogs (wird später implementiert)
  const openAddressBookDialog = () => {
    setShowAddressBook(true);
    // Hier wird später der AddressBookDialog geöffnet
    console.log("Adressbuch für", type, "öffnen");
  };

  // Prüfen, ob der Nutzer das Adressbuch nutzen darf
  const canUseAddressBook = profile?.role === 'sender_business' || 
                            profile?.role === 'community_manager' || 
                            (profile?.role === 'driver' && type === 'pickup');

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{title}</h3>
        {canUseAddressBook && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={openAddressBookDialog}
            className="ml-auto"
          >
            <Book className="mr-2 h-4 w-4" />
            Aus Adressbuch wählen
          </Button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name={`${prefix}Street`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Straße*</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Musterstraße" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}HouseNumber`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hausnummer*</FormLabel>
              <FormControl>
                <Input placeholder="z.B. 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}PostalCode`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postleitzahl*</FormLabel>
              <FormControl>
                <Input placeholder="z.B. 12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}City`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stadt*</FormLabel>
              <FormControl>
                <Input placeholder={`z.B. ${type === 'pickup' ? 'Berlin' : 'München'}`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}Country`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Land*</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Deutschland" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}AddressExtra`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresszusatz</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Hinterhof, 2. Stock" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}Phone`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefonnummer{type === 'delivery' ? ' Empfänger' : ''}</FormLabel>
              <FormControl>
                <Input placeholder="z.B. +49123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}Email`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail{type === 'delivery' ? ' Empfänger' : ''}</FormLabel>
              <FormControl>
                <Input placeholder="z.B. beispiel@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Platzhalter für den zukünftigen Adressbuch-Dialog */}
      {showAddressBook && (
        <div className="hidden">
          {/* AddressBookDialog wird in einem zukünftigen Schritt implementiert */}
        </div>
      )}
    </div>
  );
};
