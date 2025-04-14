
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DealContent } from "@/components/deal/DealContent";

const Deal = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  if (!orderId) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-16 h-[calc(100vh-180px)] flex flex-col">
          <Button 
            variant="ghost" 
            className="mb-4 pl-0 w-fit" 
            onClick={() => navigate("/offer-transport")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Übersicht
          </Button>
          <div className="flex-grow flex justify-center items-center">
            <p className="text-gray-600">Kein Auftrag ausgewählt</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-16 h-[calc(100vh-180px)] flex flex-col">
        <DealContent 
          orderId={orderId} 
          navigateToOfferTransport={() => navigate("/offer-transport")}
        />
      </div>
    </Layout>
  );
};

export default Deal;
