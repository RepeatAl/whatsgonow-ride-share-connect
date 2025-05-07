
import React from "react";
import { useOrderForm } from "@/hooks/useOrderForm";
import { GeneralInformationSection } from "./form-sections/GeneralInformationSection";
import { AddressSection } from "./form-sections/AddressSection";
import { ItemDetailsSection } from "./form-sections/ItemDetailsSection";
import { ImageUploadSection } from "./form-sections/ImageUploadSection";
import { AdditionalOptionsSection } from "./form-sections/AdditionalOptionsSection";
import { DeadlineSection } from "./form-sections/DeadlineSection";
import { SubmitButton } from "./form-sections/SubmitButton";
import { FormNavigation } from "./form-sections/FormNavigation";
import { useCreateOrderSubmit } from "./hooks/useCreateOrderSubmit";
import { FindDriverDialog } from "./FindDriverDialog";
import { useAuth } from "@/contexts/AuthContext";
import { CreateOrderFormValues } from "@/lib/validators/order";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

interface CreateOrderFormProps {
  initialData?: {
    draft_data: Partial<CreateOrderFormValues>;
    photo_urls: string[];
    items?: any[];
  };
}

const CreateOrderForm = ({ initialData }: CreateOrderFormProps) => {
  const { 
    form, 
    uploadedPhotoUrls, 
    items,
    addItem,
    removeItem,
    saveAllItems,
    tempOrderId, 
    isSaving, 
    isProcessing,
    handlePhotosUploaded, 
    handleFormClear, 
    isFormValid, 
    insuranceEnabled 
  } = useOrderForm(initialData);
  
  const { user } = useAuth();
  const { 
    handleCreateOrder, 
    isSubmitting, 
    showFindDriverDialog,
    handleFindDriverDialogClose,
    userId
  } = useCreateOrderSubmit(() => {
    // Leere Funktion, da clearDraft bereits in useCreateOrderSubmit verwendet wird
    return Promise.resolve(true);
  });

  // Funktion zum Speichern als Entwurf
  const saveDraft = async () => {
    // Der Hook useOrderDraftStorage speichert automatisch
    // Diese Funktion ist nur für den "Als Entwurf speichern" Button
    return Promise.resolve();
  };

  // Funktion zum Submit des Formulars
  const submitForm = async () => {
    const valid = await form.trigger();
    if (valid) {
      const formValues = form.getValues();
      const orderId = await handleCreateOrder(formValues, uploadedPhotoUrls);
      
      // Wenn orderId zurückgegeben wurde und Artikel vorhanden sind, speichere diese
      if (orderId && items.length > 0) {
        await saveAllItems(orderId);
      }
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Navigationsleiste für Formular-Aktionen */}
        <FormNavigation 
          onSaveDraft={saveDraft}
          onSubmitForm={submitForm}
          onClearForm={handleFormClear}
          isSaving={isSaving || isProcessing}
          isSubmitting={isSubmitting}
          isValid={isFormValid}
          isAuthenticated={!!user}
        />
        
        {/* Bestehende Formular-Sektionen */}
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
          userId={user?.id} 
          orderId={tempOrderId}
          uploadedPhotoUrls={uploadedPhotoUrls}
          onPhotosUploaded={handlePhotosUploaded}
        />
        <Separator />
        <AdditionalOptionsSection form={form} />
        <Separator />
        <DeadlineSection form={form} />
        
        {/* Submit Button am Ende des Formulars */}
        <div className="flex justify-end">
          <SubmitButton 
            isSubmitting={isSubmitting || isProcessing} 
            onClick={submitForm}
          />
        </div>
        
        {/* Dialog für "Fahrer suchen" nach erfolgreicher Veröffentlichung */}
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

export default CreateOrderForm;
