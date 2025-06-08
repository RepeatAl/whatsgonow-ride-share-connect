
import React from 'react';
import { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { User, Truck, Shield } from 'lucide-react';
import type { PreRegistrationFormData } from '@/lib/validators/pre-registration';

interface RoleSelectionFieldsProps {
  control: Control<PreRegistrationFormData>;
}

export const RoleSelectionFields: React.FC<RoleSelectionFieldsProps> = ({ control }) => {
  const { t } = useTranslation('pre_register');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('roles.title', 'Wofür möchten Sie sich registrieren?')}</h3>
      <p className="text-sm text-muted-foreground">
        {t('roles.subtitle', 'Sie können mehrere Optionen auswählen.')}
      </p>

      <div className="grid gap-4">
        <FormField
          control={control}
          name="wants_sender"
          render={({ field }) => (
            <FormItem>
              <Card className={`cursor-pointer transition-colors ${field.value ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="flex items-center space-x-4 p-4">
                  <User className="h-6 w-6 text-blue-500" />
                  <div className="flex-1">
                    <FormLabel className="text-base font-medium cursor-pointer">
                      {t('roles.sender', 'Auftraggeber')}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {t('roles.sender_description', 'Ich möchte Transportaufträge vergeben')}
                    </p>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </CardContent>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="wants_driver"
          render={({ field }) => (
            <FormItem>
              <Card className={`cursor-pointer transition-colors ${field.value ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="flex items-center space-x-4 p-4">
                  <Truck className="h-6 w-6 text-orange-500" />
                  <div className="flex-1">
                    <FormLabel className="text-base font-medium cursor-pointer">
                      {t('roles.driver', 'Fahrer')}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {t('roles.driver_description', 'Ich möchte Transportaufträge übernehmen')}
                    </p>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </CardContent>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="wants_cm"
          render={({ field }) => (
            <FormItem>
              <Card className={`cursor-pointer transition-colors ${field.value ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="flex items-center space-x-4 p-4">
                  <Shield className="h-6 w-6 text-purple-500" />
                  <div className="flex-1">
                    <FormLabel className="text-base font-medium cursor-pointer">
                      {t('roles.cm', 'Community Manager')}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {t('roles.cm_description', 'Ich möchte die Community in meiner Region betreuen')}
                    </p>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </CardContent>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="text-xs text-muted-foreground">
        {t('roles.note', 'Hinweis: Community Manager-Bewerbungen werden individuell geprüft.')}
      </div>
    </div>
  );
};
