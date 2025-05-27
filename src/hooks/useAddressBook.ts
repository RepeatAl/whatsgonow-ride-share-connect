
import { useState, useEffect, useCallback } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AddressBookEntry {
  id: string;
  name: string;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  country: string;
  is_default: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function useAddressBook() {
  const { user } = useSimpleAuth();
  const [addresses, setAddresses] = useState<AddressBookEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = useCallback(async (): Promise<AddressBookEntry[]> => {
    if (!user?.id) {
      console.warn('No user ID available for fetching addresses');
      return [];
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('address_book')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching addresses:', error);
        toast({
          title: "Fehler beim Laden",
          description: "Adressen konnten nicht geladen werden.",
          variant: "destructive"
        });
        return [];
      }

      const addressList = data || [];
      setAddresses(addressList);
      return addressList;
    } catch (err) {
      console.error('Unexpected error fetching addresses:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const addAddress = useCallback(async (address: Omit<AddressBookEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: "Nicht angemeldet",
        description: "Melde dich an, um Adressen zu speichern.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('address_book')
        .insert([{
          ...address,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding address:', error);
        throw error;
      }

      if (data) {
        setAddresses(prev => [data, ...prev]);
        toast({
          title: "Adresse hinzugefügt",
          description: "Die Adresse wurde erfolgreich gespeichert.",
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding address:', err);
      toast({
        title: "Fehler",
        description: "Adresse konnte nicht gespeichert werden.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id]);

  const updateAddress = useCallback(async (id: string, updates: Partial<AddressBookEntry>): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: "Nicht angemeldet",
        description: "Melde dich an, um Adressen zu bearbeiten.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('address_book')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating address:', error);
        throw error;
      }

      if (data) {
        setAddresses(prev => prev.map(addr => addr.id === id ? data : addr));
        toast({
          title: "Adresse aktualisiert",
          description: "Die Adresse wurde erfolgreich bearbeitet.",
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating address:', err);
      toast({
        title: "Fehler",
        description: "Adresse konnte nicht bearbeitet werden.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id]);

  const deleteAddress = useCallback(async (id: string): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: "Nicht angemeldet",
        description: "Melde dich an, um Adressen zu löschen.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('address_book')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting address:', error);
        throw error;
      }

      setAddresses(prev => prev.filter(addr => addr.id !== id));
      toast({
        title: "Adresse gelöscht",
        description: "Die Adresse wurde erfolgreich entfernt.",
      });
      return true;
    } catch (err) {
      console.error('Error deleting address:', err);
      toast({
        title: "Fehler",
        description: "Adresse konnte nicht gelöscht werden.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id]);

  const setDefaultAddress = useCallback(async (id: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      // First, remove default flag from all addresses
      await supabase
        .from('address_book')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Then set the selected address as default
      const { data, error } = await supabase
        .from('address_book')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          is_default: addr.id === id
        })));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error setting default address:', err);
      return false;
    }
  }, [user?.id]);

  // Load addresses on mount and when user changes
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const getDefaultAddress = useCallback((): AddressBookEntry | null => {
    return addresses.find(addr => addr.is_default) || null;
  }, [addresses]);

  const getAddressString = useCallback((address: AddressBookEntry): string => {
    return `${address.street} ${address.house_number}, ${address.postal_code} ${address.city}, ${address.country}`;
  }, []);

  const searchAddresses = useCallback((query: string): AddressBookEntry[] => {
    const lowerQuery = query.toLowerCase();
    return addresses.filter(addr =>
      addr.name.toLowerCase().includes(lowerQuery) ||
      addr.street.toLowerCase().includes(lowerQuery) ||
      addr.city.toLowerCase().includes(lowerQuery) ||
      addr.postal_code.includes(query)
    );
  }, [addresses]);

  const validateAddress = useCallback((address: Partial<AddressBookEntry>): string[] => {
    const errors: string[] = [];
    
    if (!address.name?.trim()) errors.push('Name ist erforderlich');
    if (!address.street?.trim()) errors.push('Straße ist erforderlich');
    if (!address.house_number?.trim()) errors.push('Hausnummer ist erforderlich');
    if (!address.postal_code?.trim()) errors.push('Postleitzahl ist erforderlich');
    if (!address.city?.trim()) errors.push('Stadt ist erforderlich');
    if (!address.country?.trim()) errors.push('Land ist erforderlich');
    
    return errors;
  }, []);

  return {
    addresses,
    loading,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    getAddressString,
    searchAddresses,
    validateAddress
  };
}
