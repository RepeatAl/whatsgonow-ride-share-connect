
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { createOrderSchema, type CreateOrderFormValues } from "@/lib/validators/order";
import { useOrderDraftStorage } from "./useOrderDraftStorage";

export function useOrderForm(initialData?: {
  draft_data: Partial<CreateOrderFormValues>;
  photo_urls: string[];
}) {
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

  const handlePhotosUploaded = useCallback((urls: string[]) => {
    setUploadedPhotoUrls(urls);
  }, []);

  const insuranceEnabled = form.watch('insurance');

  return {
    form,
    uploadedPhotoUrls,
    tempOrderId,
    clearDraft,
    isLoading,
    isSaving,
    handlePhotosUploaded,
    insuranceEnabled
  };
}
