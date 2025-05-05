
import React from "react";
import { OrderFormWrapper } from "./OrderFormWrapper";

interface CreateOrderFormProps {
  initialData?: {
    draft_data: any;
    photo_urls: string[];
  };
}

const CreateOrderForm = ({ initialData }: CreateOrderFormProps) => {
  return <OrderFormWrapper initialData={initialData} />;
};

export default CreateOrderForm;
