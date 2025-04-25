
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/validators/order";

interface AddressSectionProps {
  form: UseFormReturn<CreateOrderFormValues>;
  type: 'pickup' | 'delivery';
}

export const AddressSection = ({ form, type }: AddressSectionProps) => {
  const prefix = type === 'pickup' ? 'pickup' : 'delivery';
  const title = type === 'pickup' ? 'Abholadresse' : 'Zieladresse';

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name={`${prefix}Street` as keyof CreateOrderFormValues}
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
          name={`${prefix}HouseNumber` as keyof CreateOrderFormValues}
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
          name={`${prefix}PostalCode` as keyof CreateOrderFormValues}
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
          name={`${prefix}City` as keyof CreateOrderFormValues}
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
          name={`${prefix}Country` as keyof CreateOrderFormValues}
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
          name={`${prefix}AddressExtra` as keyof CreateOrderFormValues}
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
          name={`${prefix}Phone` as keyof CreateOrderFormValues}
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
          name={`${prefix}Email` as keyof CreateOrderFormValues}
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
    </div>
  );
};
