
import React, { useState } from "react";
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

const CreateOrderForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);
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

  const { clearDraft, isLoading, isSaving } = useOrderDraftStorage(form, uploadedPhotoUrls);
  const { handleSubmit, isSubmitting } = useOrderSubmit(user?.id, clearDraft);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  const handlePhotosUploaded = (urls: string[]) => {
    setUploadedPhotoUrls(urls);
  };

  const handleSaveDraft = () => {
    const currentValues = form.getValues();
    localStorage.setItem('order-draft', JSON.stringify({
      formValues: currentValues,
      photoUrls: uploadedPhotoUrls
    }));
    toast.success("Auftrag als Entwurf gespeichert");
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
                Als Entwurf gespeichert
              </>
            )}
          </Button>
        </div>

        <form onSubmit={form.handleSubmit((data) => handleSubmit(data, uploadedPhotoUrls))} className="space-y-6">
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
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </div>
    </Form>
  );
};

export default CreateOrderForm;
