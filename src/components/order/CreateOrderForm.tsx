import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { createOrderSchema, type CreateOrderFormValues } from "@/lib/validators/order";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import { ImageUploadSection } from "./form-sections/ImageUploadSection";
import { GeneralInformationSection } from "./form-sections/GeneralInformationSection";
import { ItemDetailsSection } from "./form-sections/ItemDetailsSection";
import { AddressSection } from "./form-sections/AddressSection";
import { AdditionalOptionsSection } from "./form-sections/AdditionalOptionsSection";
import { DeadlineSection } from "./form-sections/DeadlineSection";

const DRAFT_KEY = "order-form-draft";

interface OrderFormDraft {
  formValues: Partial<CreateOrderFormValues>;
  photoUrls: string[];
  lastModified: number;
}

const CreateOrderForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);
  const navigate = useNavigate();
  const tempOrderId = uuidv4();

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

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft: OrderFormDraft = JSON.parse(savedDraft);
        Object.entries(draft.formValues).forEach(([key, value]) => {
          form.setValue(key as keyof CreateOrderFormValues, value);
        });
        setUploadedPhotoUrls(draft.photoUrls);
      } catch (error) {
        console.error('Error loading draft:', error);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [form.setValue]);

  useEffect(() => {
    const subscription = form.watch((formValues) => {
      const draft: OrderFormDraft = {
        formValues,
        photoUrls: uploadedPhotoUrls,
        lastModified: Date.now(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, uploadedPhotoUrls]);

  const handlePhotosUploaded = (urls: string[]) => {
    setUploadedPhotoUrls(urls);
    const draft: OrderFormDraft = {
      formValues: form.getValues(),
      photoUrls: urls,
      lastModified: Date.now(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    toast.success(`${urls.length} Fotos erfolgreich hochgeladen`);
  };

  const onSubmit = async (data: CreateOrderFormValues) => {
    setIsSubmitting(true);
    try {
      const orderId = uuidv4();
      const pickupAddress = `${data.pickupStreet} ${data.pickupHouseNumber}, ${data.pickupPostalCode} ${data.pickupCity}, ${data.pickupCountry}${data.pickupAddressExtra ? ` (${data.pickupAddressExtra})` : ''}`;
      const deliveryAddress = `${data.deliveryStreet} ${data.deliveryHouseNumber}, ${data.deliveryPostalCode} ${data.deliveryCity}, ${data.deliveryCountry}${data.deliveryAddressExtra ? ` (${data.deliveryAddressExtra})` : ''}`;
      
      const { error: insertError } = await supabase
        .from("orders")
        .insert([{ 
          id: orderId, 
          description: data.description,
          from_address: pickupAddress,
          to_address: deliveryAddress,
          weight: data.weight,
          price: data.price,
          negotiable: data.negotiable,
          fragile: data.fragile,
          load_assistance: data.loadAssistance,
          tools_required: data.toolsRequired || '',
          security_measures: data.securityMeasures || '',
          item_name: data.itemName,
          category: data.category,
          preferred_vehicle_type: data.preferredVehicleType || '',
          deadline: data.deadline,
          status: 'pending',
          sender_id: user!.id,
          photo_urls: uploadedPhotoUrls
        }]);
        
      if (insertError) throw insertError;

      localStorage.removeItem(DRAFT_KEY);
      
      toast.success("Transportauftrag erfolgreich erstellt!");
      navigate(`/orders/${orderId}/edit`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Fehler beim Erstellen des Transportauftrags.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ImageUploadSection
          userId={user?.id}
          orderId={tempOrderId}
          onPhotosUploaded={handlePhotosUploaded}
        />

        <Separator />

        <GeneralInformationSection form={form} />

        <Separator />

        <ItemDetailsSection form={form} insuranceEnabled={insuranceEnabled} />

        <Separator />

        <AddressSection form={form} type="pickup" />

        <Separator />

        <AddressSection form={form} type="delivery" />

        <Separator />

        <AdditionalOptionsSection form={form} />

        <Separator />

        <DeadlineSection form={form} />

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Wird erstellt...</>
            ) : (
              "Auftrag erstellen"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateOrderForm;
