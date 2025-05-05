
import React from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { useOrderForm } from "@/hooks/useOrderForm";
import { useCreateOrderSubmit } from "./hooks/useCreateOrderSubmit";

// Import form sections
import { ImageUploadSection } from "./form-sections/ImageUploadSection";
import { GeneralInformationSection } from "./form-sections/GeneralInformationSection";
import { ItemDetailsSection } from "./form-sections/ItemDetailsSection";
import { AddressSection } from "./form-sections/AddressSection";
import { AdditionalOptionsSection } from "./form-sections/AdditionalOptionsSection";
import { DeadlineSection } from "./form-sections/DeadlineSection";
import { SubmitButton } from "./form-sections/SubmitButton";
import { FormNavigation } from "./form-sections/FormNavigation";

interface OrderFormWrapperProps {
  initialData?: {
    draft_data: any;
    photo_urls: string[];
  };
}

export const OrderFormWrapper: React.FC<OrderFormWrapperProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const {
    form,
    uploadedPhotoUrls,
    tempOrderId,
    clearDraft,
    isLoading,
    isSaving,
    handlePhotosUploaded,
    insuranceEnabled
  } = useOrderForm(initialData);

  const { handleCreateOrder, isSubmitting, userId, FindDriverDialog, showFindDriverDialog } = useCreateOrderSubmit(clearDraft);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  const handleSaveDraft = async () => {
    try {
      await clearDraft();
      localStorage.removeItem('order-draft');
      navigate("/orders/drafts");
      toast.success("Entwurf gespeichert");
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error("Fehler beim Speichern des Entwurfs");
    }
  };

  const onSubmit = async (data: any) => {
    await handleCreateOrder(data, uploadedPhotoUrls);
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <FormNavigation onSaveDraft={handleSaveDraft} isSaving={isSaving} />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ImageUploadSection
            userId={userId}
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
        
        {/* Dialog zur Fahrer-Suche nach erfolgreicher Auftragserstellung */}
        {showFindDriverDialog && <FindDriverDialog />}
      </div>
    </Form>
  );
};
