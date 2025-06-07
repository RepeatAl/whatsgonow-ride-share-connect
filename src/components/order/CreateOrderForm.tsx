
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateOrderFormValues } from '@/lib/validators/order';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import AuthRequired from '@/components/auth/AuthRequired';
import { MapPin, Package } from 'lucide-react';

interface CreateOrderFormProps {
  form: UseFormReturn<CreateOrderFormValues>;
  onSubmit: (values: CreateOrderFormValues) => Promise<void>;
}

/**
 * CreateOrderForm - Umgestellt auf "öffentlich vs. geschützt" Prinzip
 * 
 * - Formular ausfüllen: Öffentlich möglich
 * - Auftrag veröffentlichen: Login erforderlich (AuthRequired)
 */
const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ form, onSubmit }) => {
  const { t } = useTranslation(['order', 'common']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CreateOrderFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      
      {/* Öffentlicher Bereich - Formular ausfüllen ohne Login */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('order:pickup_location', 'Abholort')}
          </h3>
          
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600 text-sm mb-2">
              {t('order:address_form_placeholder', 'Adresse eingeben:')}
            </p>
            <input 
              type="text" 
              placeholder={t('order:from_address', 'Von...')}
              className="w-full p-2 border rounded"
              {...form.register('pickupStreet')}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('order:delivery_location', 'Zielort')}
          </h3>
          
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600 text-sm mb-2">
              {t('order:address_form_placeholder', 'Adresse eingeben:')}
            </p>
            <input 
              type="text" 
              placeholder={t('order:to_address', 'Nach...')}
              className="w-full p-2 border rounded"
              {...form.register('deliveryStreet')}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Package className="h-5 w-5" />
          {t('order:item_details', 'Was soll transportiert werden?')}
        </h3>
        
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <textarea 
            placeholder={t('order:item_description', 'Beschreibung des Transportguts...')}
            className="w-full p-2 border rounded h-24 resize-none"
            {...form.register('description')}
          />
        </div>
      </div>

      {/* Hinweis für öffentliche Nutzung */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 {t('order:public_hint', 'Du kannst alle Daten eingeben und vorbereiten. Zum Veröffentlichen des Auftrags ist eine kostenlose Anmeldung erforderlich.')}
        </p>
      </div>

      {/* Geschützter Bereich - Nur Veröffentlichen erfordert Login */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline">
          {t('order:save_draft', 'Als Entwurf speichern')}
        </Button>
        
        <AuthRequired 
          action="create_order" 
          loginPrompt={t('order:login_to_publish', 'Zum Veröffentlichen deines Transportauftrags ist eine Anmeldung erforderlich.')}
          onAuthSuccess={() => form.handleSubmit(handleSubmit)()}
        >
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-brand-orange hover:bg-brand-orange/90"
          >
            {isSubmitting 
              ? t('order:publishing', 'Wird veröffentlicht...') 
              : t('order:publish_order', 'Auftrag veröffentlichen')
            }
          </Button>
        </AuthRequired>
      </div>
    </form>
  );
};

export default CreateOrderForm;
