
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { createOrderSchema, type CreateOrderFormValues } from "@/lib/validators/order";
import { useOrderDraftStorage } from "./useOrderDraftStorage";
import { useNavigate } from "react-router-dom";

export function useOrderForm(initialData?: {
  draft_data: Partial<CreateOrderFormValues>;
  photo_urls: string[];
}) {
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>(
    initialData?.photo_urls || []
  );
  
  const tempOrderId = uuidv4();
  const navigate = useNavigate();

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

  const handlePhotosUploaded = useCallback((urls: string[]) => {
    setUploadedPhotoUrls(urls);
  }, []);

  const handleFormClear = useCallback(async () => {
    // Formular zurücksetzen
    form.reset();
    
    // Fotos zurücksetzen
    setUploadedPhotoUrls([]);
    
    // Draft in localStorage löschen
    await clearDraft();
    
    // Optional: Redirect or other actions
    // Wir entscheiden uns hier, auf der gleichen Seite zu bleiben
  }, [form, clearDraft]);
  
  const insuranceEnabled = form.watch('insurance');
  const isFormValid = form.formState.isValid;

  return {
    form,
    uploadedPhotoUrls,
    tempOrderId,
    clearDraft,
    isLoading,
    isSaving,
    handlePhotosUploaded,
    handleFormClear,
    insuranceEnabled,
    isFormValid
  };
}
