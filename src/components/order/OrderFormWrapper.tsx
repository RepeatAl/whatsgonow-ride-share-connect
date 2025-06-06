
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { toast } from '@/hooks/use-toast';
import { OrderSchema, OrderValues } from './OrderFormSchema';
import { OrderItem } from './types';
import AddressSection from './form-sections/AddressSection';
import ItemDetailsSection from './form-sections/ItemDetailsSection';

interface OrderFormWrapperProps {
  onSubmit: (values: OrderValues) => void;
  defaultValues?: Partial<OrderValues>;
}

const OrderFormWrapper: React.FC<OrderFormWrapperProps> = ({ onSubmit, defaultValues }) => {
  const { user } = useOptimizedAuth();
  const [isPickupSameAsDelivery, setIsPickupSameAsDelivery] = useState(false);

  const form = useForm<OrderValues>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      pickup_address: defaultValues?.pickup_address || '',
      pickup_city: defaultValues?.pickup_city || '',
      pickup_zip: defaultValues?.pickup_zip || '',
      delivery_address: defaultValues?.delivery_address || '',
      delivery_city: defaultValues?.delivery_city || '',
      delivery_zip: defaultValues?.delivery_zip || '',
      items: defaultValues?.items || [],
      notes: defaultValues?.notes || '',
    },
  });

  const handleTogglePickup = () => {
    setIsPickupSameAsDelivery(!isPickupSameAsDelivery);
  };

  const handleSubmit = (values: OrderValues) => {
    if (!user) {
      toast({
        title: 'Nicht angemeldet',
        description: 'Du musst angemeldet sein, um eine Bestellung aufzugeben.',
        variant: 'destructive',
      });
      return;
    }

    onSubmit(values);
  };

  const handleItemsChange = (items: OrderItem[]) => {
    // Convert OrderItem[] to the expected schema format
    const schemaItems = items.map(item => ({
      name: item.name || '',
      quantity: item.quantity || 1,
      weight: item.weight,
      dimensions: typeof item.dimensions === 'string' ? item.dimensions : undefined,
    }));
    form.setValue('items', schemaItems);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bestellung erstellen</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <AddressSection
              form={form}
              isPickup={isPickupSameAsDelivery}
              toggleIsPickup={handleTogglePickup}
            />
            <ItemDetailsSection
              items={form.getValues().items.map((item, index) => ({
                id: `item-${index}`,
                name: item.name || '',
                quantity: item.quantity || 1,
                weight: item.weight,
                dimensions: item.dimensions || '',
              }))}
              onItemsChange={handleItemsChange}
            />
            <Button type="submit">Bestellung aufgeben</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default OrderFormWrapper;
