
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { createOrderSchema, type CreateOrderFormValues } from "@/lib/validators/order";
import { useAuth } from "@/contexts/AuthContext";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import { ImageUploadSection } from "./form-sections/ImageUploadSection";
import { GeneralInformationSection } from "./form-sections/GeneralInformationSection";
import { ItemDetailsSection } from "./form-sections/ItemDetailsSection";
import { AddressSection } from "./form-sections/AddressSection";
import { AdditionalOptionsSection } from "./form-sections/AdditionalOptionsSection";
import { DeadlineSection } from "./form-sections/DeadlineSection";
import { SubmitButton } from "./form-sections/SubmitButton";
import { useOrderFormDraft } from "@/hooks/useOrderFormDraft";
import { useOrderSubmit } from "@/hooks/useOrderSubmit";

const CreateOrderForm = () => {
  const { user } = useAuth();
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

  const { clearDraft } = useOrderFormDraft(form, uploadedPhotoUrls);
  const { handleSubmit, isSubmitting } = useOrderSubmit(user?.id, clearDraft);

  const handlePhotosUploaded = (urls: string[]) => {
    setUploadedPhotoUrls(urls);
  };

  const insuranceEnabled = form.watch('insurance');

  return (
    <Form {...form}>
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
    </Form>
  );
};

export default CreateOrderForm;
