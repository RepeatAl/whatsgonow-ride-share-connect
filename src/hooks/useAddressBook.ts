
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { AddressBookEntry } from "@/types/address";

export function useAddressBook() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Lädt Adressen eines bestimmten Typs aus dem Adressbuch des Nutzers
   */
  const getAddressBook = useCallback(
    async (type?: 'pickup' | 'delivery'): Promise<AddressBookEntry[]> => {
      if (!user) {
        console.warn("useAddressBook: Kein Benutzer angemeldet");
        return [];
      }

      setIsLoading(true);
      try {
        let query = supabase
          .from("address_book")
          .select("*")
          .eq("user_id", user.id);

        if (type) {
          query = query.eq("type", type);
        }

        const { data, error } = await query.order('is_default', { ascending: false }).order('created_at', { ascending: false });

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
    [user]
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

        // Füge die neue Adresse hinzu
        const { data, error } = await supabase
          .from("address_book")
          .insert({
            ...entry,
            user_id: user.id
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
   * Lädt die zuletzt verwendete Lieferadresse aus der Tabelle der Aufträge
   */
  const getMostRecentDeliveryAddress = useCallback(async () => {
    if (!user) {
      console.warn("useAddressBook: Kein Benutzer angemeldet");
      return null;
    }

    try {
      // Hier würden wir normalerweise zur orders Tabelle eine Abfrage machen
      // Dies ist ein Beispiel, das angepasst werden muss
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("sender_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Diese Struktur müsste an das tatsächliche Datenbankschema angepasst werden
        // Dies ist nur ein Beispiel
        return {
          name: data[0].recipient_name,
          street: data[0].delivery_street,
          house_number: data[0].delivery_house_number,
          postal_code: data[0].delivery_postal_code,
          city: data[0].delivery_city,
          country: data[0].delivery_country,
          address_extra: data[0].delivery_address_extra,
          phone: data[0].delivery_phone,
          email: data[0].delivery_email,
          type: 'delivery' as const
        };
      }

      return null;
    } catch (error) {
      console.error("Fehler beim Laden der letzten Lieferadresse:", error);
      return null;
    }
  }, [user]);

  return {
    isLoading,
    getAddressBook,
    addAddress,
    updateAddress,
    deleteAddress,
    getMostRecentDeliveryAddress
  };
}
