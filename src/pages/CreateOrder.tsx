
import Layout from "@/components/Layout";
import CreateOrderForm from "@/components/order/CreateOrderForm";
import { BackButton } from "@/components/navigation/BackButton";

const CreateOrder = () => {
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
            <CreateOrderForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateOrder;
