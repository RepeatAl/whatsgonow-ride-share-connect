
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, MapPin, Truck, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransportRequest } from "@/data/mockData";
import TrackingMap from "@/components/tracking/TrackingMap";
import StatusProgress from "@/components/tracking/StatusProgress";
import StatusUpdateButtons from "@/components/tracking/StatusUpdateButtons";

export type TrackingStatus = "pickup" | "transit" | "delivered";

interface TrackingLocation {
  lat: number;
  lng: number;
}

const Tracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<TransportRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<TrackingStatus>("pickup");
  const [driverLocation, setDriverLocation] = useState<TrackingLocation>({
    lat: 48.135125,
    lng: 11.581981
  });

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
        navigate("/find-transport");
      }
      setIsLoading(false);
    });
  }, [orderId, navigate, toast]);

  // Simulate driver movement
  useEffect(() => {
    if (!order || status === "delivered") return;
    
    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        lat: prev.lat + (Math.random() * 0.001 - 0.0005),
        lng: prev.lng + (Math.random() * 0.001 - 0.0005)
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [order, status]);

  // Simulate WebSocket connection
  useEffect(() => {
    const socket = {
      onmessage: (callback: (data: any) => void) => {
        // Simulate receiving messages
        const interval = setInterval(() => {
          if (Math.random() > 0.8) {
            callback({
              type: "location_update",
              data: {
                lat: 48.135125 + (Math.random() * 0.01 - 0.005),
                lng: 11.581981 + (Math.random() * 0.01 - 0.005)
              }
            });
          }
        }, 5000);
        
        return () => clearInterval(interval);
      }
    };
    
    const cleanup = socket.onmessage((message) => {
      if (message.type === "location_update" && status !== "delivered") {
        setDriverLocation(message.data);
      }
    });
    
    return cleanup;
  }, [status]);

  const handleStatusUpdate = (newStatus: TrackingStatus) => {
    setStatus(newStatus);
    
    // Map status to human-readable text
    const statusText = {
      pickup: "Abholung",
      transit: "Unterwegs",
      delivered: "Zugestellt"
    }[newStatus];
    
    toast({
      title: "Status aktualisiert",
      description: `Der Status wurde auf "${statusText}" geändert.`,
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-16 h-[calc(100vh-180px)] flex flex-col">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0 w-fit" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück
        </Button>

        {isLoading ? (
          <div className="flex-grow flex justify-center items-center">
            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
          </div>
        ) : order ? (
          <div className="flex flex-col h-full gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h1 className="text-xl font-bold text-gray-900">{order.title}</h1>
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-600">
                  {order.pickupLocation} → {order.deliveryLocation}
                </div>
                <div className="text-lg font-semibold text-brand-primary">€{order.budget}</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 flex-grow">
              <div className="md:col-span-2 relative">
                <div className="rounded-lg overflow-hidden h-full min-h-[300px]">
                  <TrackingMap 
                    driverLocation={driverLocation}
                    pickupLocation={order.pickupLocation}
                    deliveryLocation={order.deliveryLocation}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-semibold mb-4">Lieferstatus</h2>
                  <StatusProgress currentStatus={status} />
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-semibold mb-4">Status aktualisieren</h2>
                  <StatusUpdateButtons 
                    currentStatus={status} 
                    onStatusUpdate={handleStatusUpdate} 
                  />
                </div>
              </div>
            </div>
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

export default Tracking;
