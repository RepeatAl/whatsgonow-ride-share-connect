
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { DeliveryConfirmation } from "@/components/delivery/DeliveryConfirmation";
import { useToast } from "@/hooks/use-toast";
import { paymentService } from "@/services/paymentService";
import { invoiceService } from "@/services/invoice";
import { deliveryService } from "@/services/deliveryService";
import PaymentStatusCard from "@/components/payment/PaymentStatusCard";
import PaymentStatusHeader from "@/components/payment/PaymentStatusHeader";
import { usePaymentStatus } from "@/hooks/use-payment-status";

const PaymentStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    paymentStatus,
    setPaymentStatus,
    order,
    setOrder,
    currentUser,
    isLoading,
    showDeliveryConfirmation,
    setShowDeliveryConfirmation,
    handleConfirmDelivery
  } = usePaymentStatus(orderId);

  const handleQRScan = async (value: string) => {
    if (!order || !order.paymentReference || !currentUser) return;
    
    setIsProcessing(true);
    try {
      // First verify delivery
      const deliveryResult = await deliveryService.verifyDelivery(
        orderId as string,
        value,
        currentUser.id
      );
      
      if (deliveryResult.success) {
        // Then release payment
        const result = await paymentService.releasePayment(order.paymentReference);
        
        if (result.success) {
          setPaymentStatus("paid");
          setOrder(prev => prev ? { ...prev, paymentStatus: "paid" } : null);
          toast({
            title: "Zahlung erfolgreich",
            description: "Die Lieferung wurde bestätigt und der Zahlungsbetrag wurde freigegeben.",
          });
          setTimeout(() => {
            navigate(`/deal/${orderId}`);
          }, 3000);
        }
      } else {
        toast({
          title: "Fehler bei der Bestätigung",
          description: deliveryResult.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Fehler bei der Zahlung",
        description: "Die Zahlungsfreigabe konnte nicht verarbeitet werden.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeliveryConfirmed = () => {
    // Refresh payment status
    if (order?.paymentReference) {
      paymentService.getPaymentStatus(order.paymentReference)
        .then(status => {
          setPaymentStatus(status);
          setOrder(prev => prev ? { ...prev, paymentStatus: status } : null);
        });
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 pt-6 pb-16">
        <PaymentStatusHeader onBack={() => navigate(`/deal/${orderId}`)} />

        {isLoading ? (
          <div className="flex-grow flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
          </div>
        ) : order ? (
          <div className="space-y-6">
            <PaymentStatusCard 
              order={order} 
              paymentStatus={paymentStatus}
              onConfirmDelivery={handleConfirmDelivery} 
            />
          </div>
        ) : (
          <div className="flex-grow flex justify-center items-center py-12">
            <p className="text-gray-600">Auftrag nicht gefunden</p>
          </div>
        )}
        
        {currentUser && orderId && (
          <DeliveryConfirmation
            orderId={orderId}
            userId={currentUser.id}
            isOpen={showDeliveryConfirmation}
            onClose={() => setShowDeliveryConfirmation(false)}
            onConfirmed={handleDeliveryConfirmed}
          />
        )}
      </div>
    </Layout>
  );
};

export default PaymentStatus;
