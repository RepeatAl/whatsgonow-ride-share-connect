
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransportRequest } from "@/data/mockData";
import ChatInterface from "@/components/chat/ChatInterface";
import RouteMap from "@/components/map/RouteMap";

const Deal = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<TransportRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch order details
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call to get order details
    import('@/data/mockData').then(({ mockRequests }) => {
      const selectedOrder = mockRequests.find(req => req.id === orderId);
      if (selectedOrder) {
        setOrder(selectedOrder);
      } else {
        toast({
          title: "Fehler",
          description: "Der Auftrag konnte nicht gefunden werden.",
          variant: "destructive"
        });
        navigate("/offer-transport");
      }
      setIsLoading(false);
    });
  }, [orderId, navigate, toast]);

  const handleStartTracking = () => {
    navigate(`/tracking/${orderId}`);
  };

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

        {isLoading ? (
          <div className="flex-grow flex justify-center items-center">
            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
          </div>
        ) : order ? (
          <div className="flex flex-col h-full">
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{order.title}</h1>
                  <div className="mt-2 text-sm text-gray-600">
                    {order.pickupLocation} → {order.deliveryLocation}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-lg font-semibold text-brand-primary">€{order.budget}</div>
                  <Button 
                    onClick={handleStartTracking}
                    className="mt-2"
                    size="sm"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Live-Tracking
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="h-[200px]">
                <RouteMap 
                  startPoint={order.pickupLocation} 
                  endPoint={order.deliveryLocation}
                  className="h-full"
                />
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border h-[200px] flex flex-col justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800">Auftragsdetails</h2>
                  <p className="text-sm text-gray-600 mt-2">Gewicht: {order.weight} kg</p>
                  <p className="text-sm text-gray-600">Dimensionen: {order.dimensions}</p>
                  <p className="text-sm text-gray-600">Abholzeitfenster: {order.pickupTimeWindow}</p>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleStartTracking}
                    variant="outline"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Live-Tracking starten
                  </Button>
                </div>
              </div>
            </div>

            <ChatInterface orderId={orderId as string} order={order} />
          </div>
        ) : (
          <div className="flex-grow flex justify-center items-center">
            <p className="text-gray-600">Auftrag nicht gefunden</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Deal;
