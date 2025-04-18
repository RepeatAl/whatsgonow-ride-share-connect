
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RegisterFormData } from './RegisterFormSchema';

interface RegisterFormFieldsProps {
  control: Control<RegisterFormData>;
  selectedRole: string;
}

export const RegisterFormFields = ({ control, selectedRole }: RegisterFormFieldsProps) => {
  const isBusinessSender = selectedRole === 'sender_business';

  return (
    <>
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-medium">Zugangsdaten</h3>
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input placeholder="deine@email.de" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passwort</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator className="my-4" />

      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-medium">Persönliche Daten</h3>
        <FormField
          control={control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rolle</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle deine Rolle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sender_private">Privater Versender</SelectItem>
                  <SelectItem value="sender_business">Geschäftlicher Versender</SelectItem>
                  <SelectItem value="driver">Fahrer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vorname</FormLabel>
                <FormControl>
                  <Input placeholder="Max" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nachname</FormLabel>
                <FormControl>
                  <Input placeholder="Mustermann" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="name_affix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Namenszusatz</FormLabel>
              <FormControl>
                <Input placeholder="Optional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isBusinessSender && (
          <FormField
            control={control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firmenname</FormLabel>
                <FormControl>
                  <Input placeholder="Musterfirma GmbH" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefonnummer</FormLabel>
              <FormControl>
                <Input placeholder="+49123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Adresse</h3>
        <FormField
          control={control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region/Bundesland</FormLabel>
              <FormControl>
                <Input placeholder="Bayern" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postleitzahl</FormLabel>
                <FormControl>
                  <Input placeholder="80331" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stadt</FormLabel>
                <FormControl>
                  <Input placeholder="München" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Straße</FormLabel>
                <FormControl>
                  <Input placeholder="Musterstraße" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="house_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hausnummer</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="address_extra"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresszusatz</FormLabel>
              <FormControl>
                <Input placeholder="Eingang B, 3. Stock" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
