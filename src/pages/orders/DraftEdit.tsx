
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import CreateOrderForm from "@/components/order/CreateOrderForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useOrderForm } from "@/hooks/useOrderForm";
import { useOrderSubmit } from "@/hooks/useOrderSubmit";

interface DraftData {
  draft_data: any;
  photo_urls: string[];
  items?: any[];
}

const DraftEdit = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { user } = useSimpleAuth();
  const { form, clearDraft } = useOrderForm();
  const { handleSubmit } = useOrderSubmit(user?.id, clearDraft);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const onSubmit = async (values: any) => {
    const result = await handleSubmit(values, []);
    if (result.success) {
      navigate('/orders');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Entwurf bearbeiten
          </h1>
          <p className="text-gray-600 mt-2">
            Bearbeiten Sie Ihren gespeicherten Auftragsentwurf.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <CreateOrderForm form={form} onSubmit={onSubmit} />
        </div>
      </div>
    </Layout>
  );
};

export default DraftEdit;
