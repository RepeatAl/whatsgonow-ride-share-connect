
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { OrderSchemaType } from '@/lib/validators/order';

interface CreateOrderFormProps {
  form: UseFormReturn<OrderSchemaType>;
  onSubmit: (values: OrderSchemaType) => Promise<void>;
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ form, onSubmit }) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Auftrag erstellen
        </h3>
        <p className="text-gray-600">
          Formular-Implementierung folgt in der nächsten Phase
        </p>
      </div>
    </form>
  );
};

export default CreateOrderForm;
