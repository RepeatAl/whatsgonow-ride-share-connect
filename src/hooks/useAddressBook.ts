
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { AddressBookEntry } from '@/types/address';

export type { AddressBookEntry };

export function useAddressBook() {
  const [addresses, setAddresses] = useState<AddressBookEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = useCallback(async (): Promise<AddressBookEntry[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('address_book')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const addressEntries = data || [];
      setAddresses(addressEntries);
      return addressEntries;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Adressen konnten nicht geladen werden',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAddressBook = fetchAddresses;

  const addAddress = useCallback(async (address: Omit<AddressBookEntry, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('address_book')
        .insert([address])
        .select()
        .single();

      if (error) throw error;

      setAddresses(prev => [data, ...prev]);
      toast({
        title: 'Erfolg',
        description: 'Adresse wurde gespeichert',
      });

      return data;
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Adresse konnte nicht gespeichert werden',
      });
      throw error;
    }
  }, []);

  const updateAddress = useCallback(async (id: string, updates: Partial<AddressBookEntry>) => {
    try {
      const { data, error } = await supabase
        .from('address_book')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAddresses(prev => prev.map(addr => 
        addr.id === id ? { ...addr, ...data } : addr
      ));

      toast({
        title: 'Erfolg',
        description: 'Adresse wurde aktualisiert',
      });

      return data;
    } catch (error) {
      console.error('Error updating address:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Adresse konnte nicht aktualisiert werden',
      });
      throw error;
    }
  }, []);

  const deleteAddress = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('address_book')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAddresses(prev => prev.filter(addr => addr.id !== id));
      toast({
        title: 'Erfolg',
        description: 'Adresse wurde gelöscht',
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Adresse konnte nicht gelöscht werden',
      });
      throw error;
    }
  }, []);

  const setAsDefault = useCallback(async (id: string) => {
    return updateAddress(id, { is_default: true });
  }, [updateAddress]);

  const getDefaultAddress = useCallback(() => {
    return addresses.find(addr => addr.is_default) || null;
  }, [addresses]);

  const validateAddress = useCallback((address: Partial<AddressBookEntry>): string[] => {
    const errors: string[] = [];
    
    if (!address.street) errors.push('Straße ist erforderlich');
    if (!address.house_number) errors.push('Hausnummer ist erforderlich');
    if (!address.postal_code) errors.push('PLZ ist erforderlich');
    if (!address.city) errors.push('Stadt ist erforderlich');
    if (!address.country) errors.push('Land ist erforderlich');
    
    return errors;
  }, []);

  return {
    addresses,
    loading,
    fetchAddresses,
    getAddressBook,
    addAddress,
    updateAddress,
    deleteAddress,
    setAsDefault,
    getDefaultAddress,
    validateAddress,
  };
}
