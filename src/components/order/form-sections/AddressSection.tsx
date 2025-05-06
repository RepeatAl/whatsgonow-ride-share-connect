
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/validators/order";
import { Button } from "@/components/ui/button";
import { Book, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { AddressBookDialog } from "@/components/address/AddressBookDialog";
import { useAddressBook } from "@/hooks/useAddressBook";
import { useProfileManager } from "@/hooks/use-profile-manager";
import { toast } from "sonner";
import { AddressBookEntry } from "@/types/address";

interface AddressSectionProps {
  form: UseFormReturn<CreateOrderFormValues>;
  type: 'pickup' | 'delivery';
}

export const AddressSection = ({ form, type }: AddressSectionProps) => {
  const prefix = type === 'pickup' ? 'pickup' : 'delivery';
  const title = type === 'pickup' ? 'Abholadresse' : 'Zieladresse';
  const { profile } = useAuth();
  const { handleSave, loadingSave } = useProfileManager();
  const [showAddressBook, setShowAddressBook] = useState(false);
  const { addAddress } = useAddressBook();

  // Funktion zum Öffnen des Adressbuch-Dialogs
  const openAddressBookDialog = () => {
    setShowAddressBook(true);
  };

  // Funktion zum Schließen des Adressbuch-Dialogs
  const closeAddressBookDialog = () => {
    setShowAddressBook(false);
  };

  // Funktion zur Übernahme einer ausgewählten Adresse aus dem Adressbuch
  const handleSelectAddress = (address: AddressBookEntry) => {
    // Alle relevanten Felder aus der ausgewählten Adresse in das Formular übernehmen
    form.setValue(`${prefix}Street`, address.street);
    form.setValue(`${prefix}HouseNumber`, address.house_number);
    form.setValue(`${prefix}PostalCode`, address.postal_code);
    form.setValue(`${prefix}City`, address.city);
    form.setValue(`${prefix}Country`, address.country);
    
    if (address.address_extra) {
      form.setValue(`${prefix}AddressExtra`, address.address_extra);
    }
    
    if (address.phone) {
      form.setValue(`${prefix}Phone`, address.phone);
    }
    
    if (address.email) {
      form.setValue(`${prefix}Email`, address.email);
    }
    
    toast.success("Adresse aus dem Adressbuch übernommen");
  };

  // Funktion zum Speichern der aktuellen Adresse im Adressbuch
  const saveToAddressBook = async () => {
    try {
      const addressData: AddressBookEntry = {
        type: type,
        street: form.getValues(`${prefix}Street`),
        house_number: form.getValues(`${prefix}HouseNumber`),
        postal_code: form.getValues(`${prefix}PostalCode`),
        city: form.getValues(`${prefix}City`),
        country: form.getValues(`${prefix}Country`),
        address_extra: form.getValues(`${prefix}AddressExtra`),
        phone: form.getValues(`${prefix}Phone`),
        email: form.getValues(`${prefix}Email`),
        source_type: 'manual'
      };

      // Validierung, dass die Pflichtfelder ausgefüllt sind
      if (!addressData.street || !addressData.house_number || !addressData.postal_code || !addressData.city) {
        toast.error("Bitte füllen Sie alle Pflichtfelder aus.");
        return;
      }

      await addAddress(addressData);
      toast.success("Adresse im Adressbuch gespeichert");
    } catch (error) {
      console.error("Fehler beim Speichern der Adresse:", error);
      toast.error("Adresse konnte nicht gespeichert werden");
    }
  };

  // Funktion zum Speichern der aktuellen Adressdaten ins Profil (nur für Abholadresse)
  const saveToProfile = async () => {
    try {
      const formValues = form.getValues();
      
      // Validierung, dass die Pflichtfelder ausgefüllt sind
      if (!formValues[`${prefix}Street`] || !formValues[`${prefix}HouseNumber`] || 
          !formValues[`${prefix}PostalCode`] || !formValues[`${prefix}City`]) {
        toast.error("Bitte füllen Sie alle Pflichtfelder aus.");
        return;
      }

      // Profildaten aus dem Formular übernehmen
      await handleSave({
        street: formValues[`${prefix}Street`],
        house_number: formValues[`${prefix}HouseNumber`],
        postal_code: formValues[`${prefix}PostalCode`],
        city: formValues[`${prefix}City`],
        country: formValues[`${prefix}Country`] || "Deutschland",
        address_extra: formValues[`${prefix}AddressExtra`]
      });
      
      toast.success("Adresse wurde im Profil gespeichert");
    } catch (error) {
      console.error("Fehler beim Speichern ins Profil:", error);
      toast.error("Adresse konnte nicht im Profil gespeichert werden");
    }
  };

  // Beim ersten Rendern die Profildaten in die Abholadresse übernehmen
  useEffect(() => {
    // Nur für die Abholadresse und nur wenn es ein Profil gibt
    if (type === 'pickup' && profile && 
        (profile.role === 'sender_private' || 
         profile.role === 'sender_business' || 
         profile.role === 'community_manager' || 
         profile.role === 'driver')) {
      
      // Nur Werte setzen, die im Profil vorhanden sind
      if (profile.street) {
        form.setValue(`${prefix}Street`, profile.street);
      }
      
      if (profile.house_number) {
        form.setValue(`${prefix}HouseNumber`, profile.house_number);
      }
      
      if (profile.postal_code) {
        form.setValue(`${prefix}PostalCode`, profile.postal_code);
      }
      
      if (profile.city) {
        form.setValue(`${prefix}City`, profile.city);
      }
      
      if (profile.address_extra) {
        form.setValue(`${prefix}AddressExtra`, profile.address_extra);
      }

      // Das Land standardmäßig auf "Deutschland" setzen, falls nicht im Profil angegeben
      form.setValue(`${prefix}Country`, "Deutschland");
      
      // Telefon und E-Mail-Adresse aus dem Profil übernehmen
      if (profile.phone) {
        form.setValue(`${prefix}Phone`, profile.phone);
      }
      
      if (profile.email) {
        form.setValue(`${prefix}Email`, profile.email);
      }
    }
  }, [profile, form, prefix, type]);

  // Prüfen, ob der Nutzer das Adressbuch nutzen darf
  const canUseAddressBook = profile?.role === 'sender_business' || 
                            profile?.role === 'community_manager' || 
                            (profile?.role === 'driver' && type === 'pickup');

  // Prüfen, ob der Nutzer die Profilspeicherung nutzen darf
  const canSaveToProfile = type === 'pickup' && 
                          (profile?.role === 'sender_private' || 
                           profile?.role === 'sender_business' || 
                           profile?.role === 'community_manager' || 
                           profile?.role === 'driver');

  return (
    <div className="space-y-4">
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
      
      {/* Buttons je nach Rolle und Adresstyp */}
      <div className="flex justify-end gap-2 mt-2">
        {/* Speichern-Button für das Profil (nur für Abholadresse) */}
        {canSaveToProfile && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={saveToProfile}
            disabled={loadingSave}
          >
            <Save className="mr-2 h-4 w-4" />
            Im Profil speichern
          </Button>
        )}
        
        {/* Speichern-Button für das Adressbuch */}
        {canUseAddressBook && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={saveToAddressBook}
          >
            <Save className="mr-2 h-4 w-4" />
            Im Adressbuch speichern
          </Button>
        )}
      </div>
      
      {/* AddressBookDialog für die Adressbuchauswahl */}
      {showAddressBook && (
        <AddressBookDialog 
          open={showAddressBook}
          onClose={closeAddressBookDialog}
          onSelect={handleSelectAddress}
          type={type}
        />
      )}
    </div>
  );
};
