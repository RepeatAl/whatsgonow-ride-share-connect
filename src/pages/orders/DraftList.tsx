
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface Draft {
  id: string;
  draft_data: any;
  created_at: string;
  updated_at: string;
}

const DraftList = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const { data, error } = await supabase
          .from("order_drafts")
          .select("*")
          .eq("status", "draft")
          .order("updated_at", { ascending: false });

        if (error) throw error;
        setDrafts(data || []);
      } catch (error) {
        console.error("Error loading drafts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gespeicherte Entwürfe</h1>
          <Button asChild>
            <Link to="/create-order">Neuer Auftrag</Link>
          </Button>
        </div>

        {drafts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Keine gespeicherten Entwürfe vorhanden.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white p-4 rounded-lg shadow-sm border hover:border-primary transition-colors"
              >
                <Link to={`/orders/drafts/${draft.id}/edit`} className="block">
                  <h3 className="font-medium mb-2">
                    {draft.draft_data.title || "Unbenannter Entwurf"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Zuletzt bearbeitet:{" "}
                    {formatDistanceToNow(new Date(draft.updated_at), {
                      addSuffix: true,
                      locale: de,
                    })}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DraftList;
