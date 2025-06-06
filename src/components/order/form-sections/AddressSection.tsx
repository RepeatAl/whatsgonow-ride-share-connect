import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';

interface AddressSectionProps {
  form: any; // Replace 'any' with the actual type of your form
  isPickup: boolean;
  toggleIsPickup: () => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({ form, isPickup, toggleIsPickup }) => {
  const { user } = useOptimizedAuth();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold mb-4">{isPickup ? 'Abholadresse' : 'Lieferadresse'}</h3>
        <Button type="button" variant="secondary" size="sm" onClick={toggleIsPickup}>
          <MapPin className="h-4 w-4 mr-2" />
          {isPickup ? 'Lieferadresse verwenden' : 'Abholadresse verwenden'}
        </Button>
      </div>

      <FormField
        control={form.control}
        name={isPickup ? 'pickup_address' : 'delivery_address'}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Input placeholder="Straße und Hausnummer" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={isPickup ? 'pickup_city' : 'delivery_city'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stadt</FormLabel>
              <FormControl>
                <Input placeholder="Stadt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={isPickup ? 'pickup_zip' : 'delivery_zip'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postleitzahl</FormLabel>
              <FormControl>
                <Input placeholder="PLZ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressSection;
