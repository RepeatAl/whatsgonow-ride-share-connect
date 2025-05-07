
import React from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { useOrderForm } from "@/hooks/useOrderForm";
import { useCreateOrderSubmit } from "./hooks/useCreateOrderSubmit";
import { FindDriverDialog } from "./FindDriverDialog";
import { useAuth } from "@/contexts/AuthContext";

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
    items?: any[];
  };
}

export const OrderFormWrapper: React.FC<OrderFormWrapperProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    form,
    uploadedPhotoUrls,
    items,
    addItem,
    removeItem,
    saveAllItems,
    tempOrderId,
    clearDraft,
    isLoading,
    isSaving,
    isProcessing,
    handlePhotosUploaded,
    handleFormClear,
    insuranceEnabled,
    isFormValid
  } = useOrderForm(initialData);

  const { 
    handleCreateOrder, 
    isSubmitting, 
    userId,
    showFindDriverDialog,
    handleFindDriverDialogClose 
  } = useCreateOrderSubmit(clearDraft);

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
    // Zuerst Auftrag erstellen
    const orderId = await handleCreateOrder(data, uploadedPhotoUrls);
    
    // Wenn orderId zurückgegeben wurde und Artikel vorhanden sind, speichere diese
    if (orderId && items.length > 0) {
      await saveAllItems(orderId);
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <FormNavigation 
          onSaveDraft={handleSaveDraft}
          onSubmitForm={form.handleSubmit(onSubmit)} 
          onClearForm={handleFormClear}
          isSaving={isSaving || isProcessing}
          isSubmitting={isSubmitting}
          isValid={isFormValid}
          isAuthenticated={!!user}
        />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <GeneralInformationSection form={form} />
          <Separator />
          <AddressSection form={form} type="pickup" />
          <Separator />
          <AddressSection form={form} type="delivery" />
          <Separator />
          <ItemDetailsSection 
            form={form} 
            insuranceEnabled={insuranceEnabled} 
            items={items}
            onAddItem={addItem}
            onRemoveItem={removeItem}
          />
          <Separator />
          <ImageUploadSection
            userId={userId}
            orderId={tempOrderId}
            onPhotosUploaded={handlePhotosUploaded}
            existingUrls={uploadedPhotoUrls}
          />
          <Separator />
          <AdditionalOptionsSection form={form} />
          <Separator />
          <DeadlineSection form={form} />
          <SubmitButton isSubmitting={isSubmitting || isProcessing} />
        </form>
        
        {/* Dialog zur Fahrer-Suche nach erfolgreicher Auftragserstellung */}
        {showFindDriverDialog && (
          <FindDriverDialog 
            open={showFindDriverDialog}
            onClose={handleFindDriverDialogClose}
          />
        )}
      </div>
    </Form>
  );
};
