
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TransportRequest } from "@/data/mockData";
import { TrackingStatus } from "@/pages/Tracking";

export function useDealData(orderId: string, navigateToOfferTransport: () => void) {
  const { toast } = useToast();
  const [order, setOrder] = useState<TransportRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<TrackingStatus>("pickup");
  const [statusUpdateTime, setStatusUpdateTime] = useState<Date | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setCurrentUser({ id: data.session.user.id });
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    setIsLoading(true);
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
        navigateToOfferTransport();
      }
      setIsLoading(false);
    });
  }, [orderId, navigateToOfferTransport, toast]);

  const handleStatusUpdate = (newStatus: TrackingStatus) => {
    setStatus(newStatus);
    setStatusUpdateTime(new Date());
    
    const statusText = {
      pickup: "Abholung",
      transit: "Unterwegs",
      delivered: "Zugestellt"
    }[newStatus];
    
    toast({
      title: "Status aktualisiert",
      description: `Der Status wurde auf "${statusText}" geändert.`,
    });

    setTimeout(() => {
      toast({
        title: "Kundenmitteilung",
        description: `Der Kunde wurde über den neuen Status "${statusText}" informiert.`,
      });
    }, 1500);
  };

  return {
    order,
    isLoading,
    status,
    statusUpdateTime,
    currentUser,
    setStatus,
    handleStatusUpdate
  };
}
