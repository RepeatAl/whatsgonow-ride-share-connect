
import Layout from "@/components/Layout";
import CreateOrderForm from "@/components/order/CreateOrderForm";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { BackButton } from "@/components/navigation/BackButton";
import { useOrderForm } from "@/hooks/useOrderForm";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useOrderSubmit } from "@/hooks/useOrderSubmit";

const CreateOrder = () => {
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
            <h1 className="text-3xl font-bold text-gray-900">Auftrag erstellen</h1>
            <p className="text-gray-600 mt-2">
              Geben Sie alle notwendigen Informationen an, um einen neuen Transportauftrag zu erstellen.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Suspense fallback={
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }>
              <CreateOrderForm form={form} onSubmit={onSubmit} />
            </Suspense>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateOrder;
