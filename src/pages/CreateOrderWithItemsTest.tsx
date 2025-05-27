
import React from "react";
import Layout from "@/components/Layout";
import CreateOrderForm from "@/components/order/CreateOrderForm";
import { BackButton } from "@/components/navigation/BackButton";
import { useOrderForm } from "@/hooks/useOrderForm";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useOrderSubmit } from "@/hooks/useOrderSubmit";

const CreateOrderWithItemsTest = () => {
  const { user } = useSimpleAuth();
  const { form, clearDraft } = useOrderForm();
  const { handleSubmit } = useOrderSubmit(user?.id, clearDraft);

  const onSubmit = async (values: any) => {
    await handleSubmit(values, []);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-16">
        <BackButton />
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Auftrag mit Artikeln erstellen (Testseite)</h1>
            <p className="text-gray-600 mt-2">
              Diese Seite dient zum Testen der Artikelverwaltung beim Erstellen eines Auftrags.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <CreateOrderForm form={form} onSubmit={onSubmit} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateOrderWithItemsTest;
