
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TransportRequest } from "@/data/mockData";
import { TrackingStatus } from "@/pages/Tracking";
import { useToast } from "@/hooks/use-toast";
import { ratingService } from "@/services/ratingService";
import { paymentService } from "@/services/paymentService";
import { deliveryService } from "@/services/deliveryService";
import { PaymentStatus } from "@/types/payment";
import { DealHeader } from "@/components/deal/DealHeader";
import { QRCodeSection } from "@/components/deal/QRCodeSection";
import { DealInfoGrid } from "@/components/deal/DealInfoGrid";
import { StatusSection } from "@/components/deal/StatusSection";
import { RatingSection } from "@/components/deal/RatingSection";
import { DeliveryConfirmation } from "@/components/delivery/DeliveryConfirmation";
import ChatInterface from "@/components/chat/ChatInterface";
import RatingModal from "@/components/rating/RatingModal";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DealContentProps {
  orderId: string;
  navigateToOfferTransport: () => void;
}

export const DealContent = ({ orderId, navigateToOfferTransport }: DealContentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<TransportRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<TrackingStatus>("pickup");
  const [statusUpdateTime, setStatusUpdateTime] = useState<Date | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showDeliveryConfirmation, setShowDeliveryConfirmation] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);
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
        const qrValue = `delivery-confirm:${selectedOrder.id}:${Date.now()}`;
        setQrCodeValue(qrValue);
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

  useEffect(() => {
    if (order && status === "delivered" && order.paymentStatus === "paid") {
      const checkRating = async () => {
        const hasUserRated = await ratingService.hasRated("current-user", orderId as string);
        setHasRated(hasUserRated);
        
        if (!hasUserRated) {
          setShowRatingModal(true);
        }
      };
      
      checkRating();
    }
  }, [order, status, orderId]);

  const handleStartTracking = () => {
    navigate(`/tracking/${orderId}`);
  };

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
    
    if (newStatus === "delivered") {
      setShowDeliveryConfirmation(true);
    }
  };

  const handleReservePayment = async () => {
    if (!order) return;
    
    setIsProcessingPayment(true);
    try {
      const result = await paymentService.reservePayment(order.id, order.budget);
      
      if (result.success) {
        const updatedOrder = { 
          ...order, 
          paymentStatus: result.status as PaymentStatus,
          paymentReference: result.reference
        };
        setOrder(updatedOrder);
        
        toast({
          title: "Zahlung vorgemerkt",
          description: "Die Zahlung wurde erfolgreich vorgemerkt. Sie wird nach Lieferung freigegeben.",
        });
        
        navigate(`/payment-status/${orderId}`);
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Zahlung konnte nicht vorgemerkt werden.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleViewPaymentStatus = () => {
    navigate(`/payment-status/${orderId}`);
  };

  const handleQRScan = async (value: string) => {
    if (!order || !order.paymentReference || !currentUser) return;
    
    setIsProcessingPayment(true);
    try {
      // First verify delivery
      const deliveryResult = await deliveryService.verifyDelivery(
        orderId,
        value,
        currentUser.id
      );
      
      if (deliveryResult.success) {
        // Then release payment
        const paymentResult = await paymentService.releasePayment(order.paymentReference);
        
        if (paymentResult.success) {
          setOrder(prev => prev ? { ...prev, paymentStatus: "paid" } : null);
          
          toast({
            title: "Lieferung bestätigt",
            description: "Die Lieferung wurde erfolgreich bestätigt und die Zahlung freigegeben.",
          });
          
          setShowQRCode(false);
        }
      } else {
        toast({
          title: "Fehler",
          description: deliveryResult.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Bestätigung konnte nicht verarbeitet werden.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDeliveryConfirmed = () => {
    // Update local state
    setStatus("delivered");
    
    // If there's payment, navigate to payment status
    if (order?.paymentReference) {
      navigate(`/payment-status/${orderId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-grow flex justify-center items-center">
        <p className="text-gray-600">Auftrag nicht gefunden</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <DealHeader 
        order={order}
        isProcessingPayment={isProcessingPayment}
        handleReservePayment={handleReservePayment}
        handleViewPaymentStatus={handleViewPaymentStatus}
        handleStartTracking={handleStartTracking}
      />
      
      {showQRCode && (
        <QRCodeSection
          qrCodeValue={qrCodeValue}
          isProcessingPayment={isProcessingPayment}
          setShowQRCode={setShowQRCode}
          handleQRScan={handleQRScan}
        />
      )}
      
      <DealInfoGrid 
        order={order}
        handleStartTracking={handleStartTracking}
        setShowQRCode={setShowQRCode}
      />

      <StatusSection 
        status={status}
        statusUpdateTime={statusUpdateTime}
        onStatusUpdate={handleStatusUpdate}
      />

      {order.paymentStatus === "paid" && status === "delivered" && (
        <RatingSection 
          orderId={orderId}
          userId="driver-123"
          currentUserId="current-user"
          hasRated={hasRated}
          role="driver"
        />
      )}

      <ChatInterface orderId={orderId} order={order} currentStatus={status} />
      
      <RatingModal 
        isOpen={showRatingModal} 
        onClose={() => setShowRatingModal(false)} 
        userId="driver-123"
        orderId={orderId}
        userName="Max Mustermann"
      />

      {currentUser && (
        <DeliveryConfirmation
          orderId={orderId}
          userId={currentUser.id}
          isOpen={showDeliveryConfirmation}
          onClose={() => setShowDeliveryConfirmation(false)}
          onConfirmed={handleDeliveryConfirmed}
        />
      )}
    </div>
  );
};
