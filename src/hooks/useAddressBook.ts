
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { AddressBookEntry } from "@/types/address";

export function useAddressBook() {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Lädt Adressen aus dem Adressbuch basierend auf Benutzerrolle und ggf. regionaler Zuordnung
   */
  const getAddressBook = useCallback(
    async (type?: 'pickup' | 'delivery'): Promise<AddressBookEntry[]> => {
      if (!user || !profile) {
        console.warn("useAddressBook: Kein Benutzer angemeldet oder kein Profil geladen");
        return [];
      }

      setIsLoading(true);
      try {
        let query = supabase.from("address_book").select("*");

        // Rollenbasierte Filterung
        if (profile.role?.startsWith('sender_')) {
          // Sender sehen nur eigene Adressen
          query = query.eq("user_id", user.id);
        } else if (profile.role === 'driver') {
          // Fahrer sehen nur Businesskunden und eigene Adressen
          query = query.or(`user_id.eq.${user.id},and(user_id.neq.${user.id},source_type.eq.from_order)`);
        } else if (profile.role === 'cm' && profile.region) {
          // Community Manager sehen Adressen von allen Nutzern in ihrer Region
          // Hier wird vorausgesetzt, dass wir die Region des Benutzers kennen
          const { data: regionUsers } = await supabase
            .from("profiles")
            .select("user_id")
            .eq("region", profile.region);
          
          if (regionUsers && regionUsers.length > 0) {
            const userIds = regionUsers.map(user => user.user_id);
            query = query.in("user_id", userIds);
          } else {
            // Fallback, wenn keine Nutzer in der Region gefunden wurden
            query = query.eq("user_id", user.id);
          }
        } else {
          // Fallback für alle anderen Rollen
          query = query.eq("user_id", user.id);
        }

        // Filterung nach Adresstyp, falls angegeben
        if (type) {
          query = query.eq("type", type);
        }

        const { data, error } = await query
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error("Fehler beim Laden des Adressbuchs:", error);
        toast.error("Adressbuch konnte nicht geladen werden.");
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [user, profile]
  );

  /**
   * Fügt eine neue Adresse zum Adressbuch hinzu
   */
  const addAddress = useCallback(
    async (entry: AddressBookEntry): Promise<string | null> => {
      if (!user) {
        toast.error("Bitte melden Sie sich an, um eine Adresse zu speichern.");
        return null;
      }

      setIsLoading(true);
      try {
        // Wenn diese Adresse als Standard gesetzt wird, entferne vorherige Standard-Markierungen
        if (entry.is_default) {
          await supabase
            .from("address_book")
            .update({ is_default: false })
            .eq("user_id", user.id)
            .eq("type", entry.type);
        }

        // Setze source_type auf 'manual', wenn nicht angegeben
        const sourceType = entry.source_type || 'manual';

        // Füge die neue Adresse hinzu
        const { data, error } = await supabase
          .from("address_book")
          .insert({
            ...entry,
            user_id: user.id,
            source_type: sourceType
          })
          .select("id")
          .single();

        if (error) {
          throw error;
        }

        toast.success("Adresse erfolgreich gespeichert");
        return data?.id || null;
      } catch (error) {
        console.error("Fehler beim Speichern der Adresse:", error);
        toast.error("Adresse konnte nicht gespeichert werden.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  /**
   * Aktualisiert eine bestehende Adresse im Adressbuch
   */
  const updateAddress = useCallback(
    async (id: string, entry: Partial<AddressBookEntry>): Promise<boolean> => {
      if (!user) {
        toast.error("Bitte melden Sie sich an, um eine Adresse zu aktualisieren.");
        return false;
      }

      setIsLoading(true);
      try {
        // Wenn diese Adresse als Standard gesetzt wird, entferne vorherige Standard-Markierungen
        if (entry.is_default) {
          await supabase
            .from("address_book")
            .update({ is_default: false })
            .eq("user_id", user.id)
            .eq("type", entry.type as 'pickup' | 'delivery');
        }

        // Aktualisiere die Adresse
        const { error } = await supabase
          .from("address_book")
          .update(entry)
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        toast.success("Adresse erfolgreich aktualisiert");
        return true;
      } catch (error) {
        console.error("Fehler beim Aktualisieren der Adresse:", error);
        toast.error("Adresse konnte nicht aktualisiert werden.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  /**
   * Löscht eine Adresse aus dem Adressbuch
   */
  const deleteAddress = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error("Bitte melden Sie sich an, um eine Adresse zu löschen.");
        return false;
      }

      setIsLoading(true);
      try {
        const { error } = await supabase
          .from("address_book")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        toast.success("Adresse erfolgreich gelöscht");
        return true;
      } catch (error) {
        console.error("Fehler beim Löschen der Adresse:", error);
        toast.error("Adresse konnte nicht gelöscht werden.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  /**
   * Konvertiert eine Auftragsadresse in ein AddressBookEntry
   */
  const orderAddressToAddressBookEntry = useCallback(
    (formData: any, type: 'pickup' | 'delivery'): AddressBookEntry => {
      const prefix = type === 'pickup' ? 'pickup' : 'delivery';
      
      return {
        type,
        street: formData[`${prefix}Street`],
        house_number: formData[`${prefix}HouseNumber`],
        postal_code: formData[`${prefix}PostalCode`],
        city: formData[`${prefix}City`],
        country: formData[`${prefix}Country`],
        address_extra: formData[`${prefix}AddressExtra`],
        phone: formData[`${prefix}Phone`],
        email: formData[`${prefix}Email`],
        name: formData[`${prefix}Name`] || '',
        source_type: 'from_order'
      };
    },
    []
  );

  /**
   * Lädt die zuletzt verwendete Lieferadresse aus der Tabelle der Aufträge
   */
  const getMostRecentDeliveryAddress = useCallback(async () => {
    if (!user) {
      console.warn("useAddressBook: Kein Benutzer angemeldet");
      return null;
    }

    try {
      // Versuche zuerst eine Standard-Adresse zu finden
      const { data: defaultAddress, error: defaultError } = await supabase
        .from("address_book")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "delivery")
        .eq("is_default", true)
        .single();

      if (!defaultError && defaultAddress) {
        return defaultAddress;
      }

      // Wenn keine Standard-Adresse gefunden wurde, versuche die neueste Adresse zu finden
      const { data: recentAddress, error: recentError } = await supabase
        .from("address_book")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "delivery")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!recentError && recentAddress) {
        return recentAddress;
      }

      // Als Fallback, versuche eine Adresse aus der letzten Bestellung zu finden
      const { data: orderAddress, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("sender_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (orderError || !orderAddress) {
        return null;
      }

      // Konvertierung der Bestelladresse in ein AddressBookEntry-Format
      // Dies muss an das tatsächliche Datenbankschema angepasst werden
      return {
        type: 'delivery' as const,
        street: 'Extrahiert aus to_address',
        house_number: 'Extrahiert aus to_address',
        postal_code: 'Extrahiert aus to_address',
        city: 'Extrahiert aus to_address',
        country: 'Extrahiert aus to_address',
        source_type: 'auto'
      };
    } catch (error) {
      console.error("Fehler beim Laden der letzten Lieferadresse:", error);
      return null;
    }
  }, [user]);

  /**
   * Auto-Speichert Adressen basierend auf Benutzerrolle und Kontext
   */
  const autoSaveAddressFromOrder = useCallback(
    async (formData: any): Promise<void> => {
      if (!user || !profile) {
        console.warn("Automatische Adressspeicherung: Kein Benutzer angemeldet oder kein Profil geladen");
        return;
      }

      try {
        // Auto-Save für Business-Kunden und Community Manager
        if (profile.role === 'sender_business' || profile.role === 'community_manager') {
          const deliveryAddressEntry = orderAddressToAddressBookEntry(formData, 'delivery');
          
          // Prüfen ob diese Adresse bereits existiert
          const { data: existingAddresses } = await supabase
            .from("address_book")
            .select("id")
            .eq("user_id", user.id)
            .eq("type", "delivery")
            .eq("street", deliveryAddressEntry.street)
            .eq("house_number", deliveryAddressEntry.house_number)
            .eq("postal_code", deliveryAddressEntry.postal_code);
          
          // Nur speichern, wenn die Adresse noch nicht existiert
          if (!existingAddresses || existingAddresses.length === 0) {
            await addAddress(deliveryAddressEntry);
          }
        }
        
        // Für Fahrer: Speichern von Business-Kunden-Adressen
        if (profile.role === 'driver' && formData.senderRole === 'sender_business') {
          const pickupAddressEntry = orderAddressToAddressBookEntry(formData, 'pickup');
          pickupAddressEntry.name = formData.senderCompanyName || 'Business-Kunde';
          
          // Prüfen ob diese Adresse bereits existiert
          const { data: existingAddresses } = await supabase
            .from("address_book")
            .select("id")
            .eq("user_id", user.id)
            .eq("type", "pickup")
            .eq("street", pickupAddressEntry.street)
            .eq("house_number", pickupAddressEntry.house_number)
            .eq("postal_code", pickupAddressEntry.postal_code);
          
          // Nur speichern, wenn die Adresse noch nicht existiert
          if (!existingAddresses || existingAddresses.length === 0) {
            await addAddress(pickupAddressEntry);
          }
        }
      } catch (error) {
        console.error("Fehler bei der automatischen Adressspeicherung:", error);
        // Kein Toast-Fehler anzeigen, da automatische Funktion
      }
    },
    [user, profile, addAddress, orderAddressToAddressBookEntry]
  );

  return {
    isLoading,
    getAddressBook,
    addAddress,
    updateAddress,
    deleteAddress,
    getMostRecentDeliveryAddress,
    autoSaveAddressFromOrder,
    orderAddressToAddressBookEntry
  };
}
