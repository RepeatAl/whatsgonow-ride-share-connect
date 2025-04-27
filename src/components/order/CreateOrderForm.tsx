
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { createOrderSchema, type CreateOrderFormValues } from "@/lib/validators/order";
import { useAuth } from "@/contexts/AuthContext";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ImageUploadSection } from "./form-sections/ImageUploadSection";
import { GeneralInformationSection } from "./form-sections/GeneralInformationSection";
import { ItemDetailsSection } from "./form-sections/ItemDetailsSection";
import { AddressSection } from "./form-sections/AddressSection";
import { AdditionalOptionsSection } from "./form-sections/AdditionalOptionsSection";
import { DeadlineSection } from "./form-sections/DeadlineSection";
import { SubmitButton } from "./form-sections/SubmitButton";
import { useOrderDraftStorage } from "@/hooks/useOrderDraftStorage";
import { useOrderSubmit } from "@/hooks/useOrderSubmit";
import { ArrowLeft, Save } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

interface CreateOrderFormProps {
  initialData?: {
    draft_data: Partial<CreateOrderFormValues>;
    photo_urls: string[];
  };
}

const CreateOrderForm = ({ initialData }: CreateOrderFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>(
    initialData?.photo_urls || []
  );
  const tempOrderId = uuidv4();

  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: initialData?.draft_data || {
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

  const { clearDraft, isLoading, isSaving } = useOrderDraftStorage(form, uploadedPhotoUrls);
  const { handleSubmit: submitOrder, isSubmitting } = useOrderSubmit(user?.id, clearDraft);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  const handlePhotosUploaded = useCallback((urls: string[]) => {
    setUploadedPhotoUrls(urls);
  }, []);

  const handleSaveDraft = async () => {
    try {
      const currentValues = form.getValues();
      await clearDraft();
      localStorage.removeItem('order-draft');
      navigate("/orders/drafts");
      toast.success("Entwurf gespeichert");
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error("Fehler beim Speichern des Entwurfs");
    }
  };

  const handleCreateOrder = async (data: CreateOrderFormValues) => {
    try {
      // First upload any remaining photos
      const result = await submitOrder(data, uploadedPhotoUrls);
      
      // Ensure we have a valid result before navigating
      if (result && result.success) {
        // Clear any local storage or form data to prevent state persistence issues
        form.reset();
        clearDraft();
        localStorage.removeItem('order-draft');
        
        // Navigate to the orders page with a small delay to ensure cleanup is complete
        setTimeout(() => {
          navigate("/orders", { replace: true });
        }, 100);
      } else {
        // Handle submission error
        toast.error("Fehler beim Erstellen des Auftrags: " + (result?.error || "Unbekannter Fehler"));
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Fehler beim Erstellen des Auftrags");
    }
  };

  const insuranceEnabled = form.watch('insurance');

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="mb-4"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Speichert...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Als Entwurf speichern
              </>
            )}
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(handleCreateOrder)} className="space-y-6">
          <ImageUploadSection
            userId={user?.id}
            orderId={tempOrderId}
            onPhotosUploaded={handlePhotosUploaded}
            existingUrls={uploadedPhotoUrls}
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
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </div>
    </Form>
  );
};

export default CreateOrderForm;
