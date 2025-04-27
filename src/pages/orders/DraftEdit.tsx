
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import Layout from "@/components/Layout";
import CreateOrderForm from "@/components/order/CreateOrderForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

const DraftEdit = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [draftData, setDraftData] = useState<any>(null);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const { data, error } = await supabase
          .from("order_drafts")
          .select("*")
          .eq("id", draftId)
          .single();

        if (error) throw error;
        setDraftData(data);
      } catch (error) {
        console.error("Error loading draft:", error);
        toast.error("Entwurf konnte nicht geladen werden");
        navigate("/orders/drafts");
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [draftId, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!draftData) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <p>Entwurf nicht gefunden.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <CreateOrderForm initialData={draftData} />
      </div>
    </Layout>
  );
};

export default DraftEdit;
