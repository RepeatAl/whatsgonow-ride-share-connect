
import React, { useState } from "react";
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

const CreateOrderForm = () => {
  const { form, uploadedPhotoUrls, isSaving, handlePhotosUploaded, handleFormClear, isFormValid } = useOrderForm();
  const { user } = useAuth();
  const { 
    handleCreateOrder, 
    isSubmitting, 
    showFindDriverDialog,
    handleFindDriverDialogClose
  } = useCreateOrderSubmit(() => {
    // Leere Funktion, da clearDraft bereits in useCreateOrderSubmit verwendet wird
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
      await handleCreateOrder(formValues, uploadedPhotoUrls);
    }
  };

  return (
    <form className="space-y-8">
      {/* Navigationsleiste für Formular-Aktionen */}
      <FormNavigation 
        onSaveDraft={saveDraft}
        onSubmitForm={submitForm}
        onClearForm={handleFormClear}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
        isValid={isFormValid}
        isAuthenticated={!!user}
      />
      
      {/* Bestehende Formular-Sektionen */}
      <GeneralInformationSection form={form} />
      <AddressSection form={form} type="pickup" />
      <AddressSection form={form} type="delivery" />
      <ItemDetailsSection form={form} />
      <ImageUploadSection 
        tempOrderId={form.getValues('id') || ''} 
        uploadedPhotoUrls={uploadedPhotoUrls}
        onPhotosUploaded={handlePhotosUploaded}
      />
      <AdditionalOptionsSection form={form} />
      <DeadlineSection form={form} />
      
      {/* Submit Button am Ende des Formulars */}
      <div className="flex justify-end">
        <SubmitButton isSubmitting={isSubmitting} onClick={submitForm} />
      </div>
      
      {/* Dialog für "Fahrer suchen" nach erfolgreicher Veröffentlichung */}
      {showFindDriverDialog && (
        <FindDriverDialog
          open={showFindDriverDialog}
          onClose={handleFindDriverDialogClose}
        />
      )}
    </form>
  );
};

export default CreateOrderForm;
