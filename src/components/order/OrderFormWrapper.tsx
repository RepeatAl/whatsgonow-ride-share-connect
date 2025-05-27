
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Send } from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from '@/hooks/use-toast';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useTranslation } from 'react-i18next';
import CreateOrderForm from './CreateOrderForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrderSchema, CreateOrderFormValues } from '@/lib/validators/order';

interface OrderFormWrapperProps {
  isEditMode?: boolean;
  orderId?: string;
}

const OrderFormWrapper: React.FC<OrderFormWrapperProps> = ({ isEditMode = false, orderId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useSimpleAuth();

  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      title: "",
      description: "",
      pickupStreet: "",
      pickupHouseNumber: "",
      pickupPostalCode: "",
      pickupCity: "",
      pickupCountry: "Deutschland",
      pickupAddressExtra: "",
      pickupPhone: "",
      pickupEmail: "",
      deliveryStreet: "",
      deliveryHouseNumber: "",
      deliveryPostalCode: "",
      deliveryCity: "",
      deliveryCountry: "Deutschland",
      deliveryAddressExtra: "",
      deliveryPhone: "",
      deliveryEmail: "",
      itemName: "",
      category: "",
      width: undefined,
      height: undefined,
      depth: undefined,
      weight: undefined,
      value: undefined,
      insurance: false,
      fragile: false,
      loadAssistance: false,
      toolsRequired: "",
      securityMeasures: "",
      price: undefined,
      negotiable: false,
      preferredVehicleType: "",
      pickupTimeStart: undefined,
      pickupTimeEnd: undefined,
      deliveryTimeStart: undefined,
      deliveryTimeEnd: undefined,
      deadline: undefined,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // Simulate saving logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: t('order_form.draft_saved'),
        description: t('order_form.draft_saved_description'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('order_form.draft_save_error'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitOrder = async (values: CreateOrderFormValues) => {
    setIsSaving(true);
    try {
      // Simulate submit logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: t('order_form.order_submitted'),
        description: t('order_form.order_submitted_description'),
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('order_form.order_submit_error'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? t('order_form.edit_order') : t('order_form.create_new_order')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back')}
              </Button>
            </div>
            <CreateOrderForm form={form} onSubmit={handleSubmitOrder} />
            <div className="flex justify-between mt-6">
              <Button variant="secondary" onClick={handleSaveDraft} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {t('order_form.save_draft')}
              </Button>
              <Button type="submit" onClick={form.handleSubmit(handleSubmitOrder)} disabled={isSaving}>
                <Send className="mr-2 h-4 w-4" />
                {t('order_form.submit_order')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderFormWrapper;
