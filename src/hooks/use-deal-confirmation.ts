
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { TransportRequest } from "@/data/mockData";
import { TrackingStatus } from "@/pages/Tracking";
import { paymentService } from "@/services/paymentService";
import { deliveryService } from "@/services/deliveryService";

export const useDealConfirmation = (orderId: string, order: TransportRequest | null, currentUser: { id: string } | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showDeliveryConfirmation, setShowDeliveryConfirmation] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");

  const handleReservePayment = async () => {
    if (!order) return;
    
    setIsProcessingPayment(true);
    try {
      const result = await paymentService.reservePayment(order.id, order.budget);
      
      if (result.success) {
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
    // If there's payment, navigate to payment status
    if (order?.paymentReference) {
      navigate(`/payment-status/${orderId}`);
    }
  };

  return {
    isProcessingPayment,
    showQRCode,
    setShowQRCode,
    showDeliveryConfirmation,
    setShowDeliveryConfirmation,
    qrCodeValue,
    setQrCodeValue,
    handleReservePayment,
    handleQRScan,
    handleDeliveryConfirmed,
  };
};
