
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  CheckCircle2, 
  Loader2, 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  AlertTriangle,
  BadgeDollarSign,
  Scan
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import QRCode from "@/components/payment/QRCode";
import { DeliveryConfirmation } from "@/components/delivery/DeliveryConfirmation";
import UserRating from "@/components/rating/UserRating";
import { mockRequests, TransportRequest } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { paymentService } from "@/services/paymentService";
import { deliveryService } from "@/services/deliveryService";
import { PaymentStatus as PaymentStatusType } from "@/types/payment";
import { supabase } from "@/integrations/supabase/client";

const PaymentStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>("pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const [order, setOrder] = useState<TransportRequest | null>(null);
  const [showDeliveryConfirmation, setShowDeliveryConfirmation] = useState(false);
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

  const { data: orderData, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const order = mockRequests.find(req => req.id === orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      
      setOrder(order);
      if (order.paymentStatus) {
        setPaymentStatus(order.paymentStatus as PaymentStatusType);
      }
      
      return order;
    }
  });

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

  const handleConfirmDelivery = () => {
    setShowDeliveryConfirmation(true);
  };

  const getStatusDisplay = () => {
    switch (paymentStatus) {
      case "reserved":
        return {
          title: "Zahlung vorgemerkt",
          description: "Die Zahlung wurde erfolgreich vorgemerkt und wird nach Lieferung freigegeben.",
          icon: <BadgeDollarSign className="h-8 w-8 text-brand-primary" />,
          bgColor: "bg-blue-50",
          color: "text-blue-800"
        };
      case "paid":
        return {
          title: "Zahlung abgeschlossen",
          description: "Die Zahlung wurde erfolgreich verarbeitet.",
          icon: <CheckCircle2 className="h-8 w-8 text-green-600" />,
          bgColor: "bg-green-50",
          color: "text-green-800"
        };
      case "cancelled":
        return {
          title: "Zahlung storniert",
          description: "Die Zahlung wurde storniert.",
          icon: <AlertTriangle className="h-8 w-8 text-yellow-600" />,
          bgColor: "bg-yellow-50",
          color: "text-yellow-800"
        };
      default:
        return {
          title: "Zahlungsstatus Ausstehend",
          description: "Die Zahlung wird noch bearbeitet.",
          icon: <CreditCard className="h-8 w-8 text-gray-600" />,
          bgColor: "bg-gray-50",
          color: "text-gray-800"
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 pt-6 pb-16">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0 w-fit" 
          onClick={() => navigate(`/deal/${orderId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Auftrag
        </Button>

        {isLoading ? (
          <div className="flex-grow flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
          </div>
        ) : order ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className={`${statusDisplay.bgColor} ${statusDisplay.color} rounded-t-lg`}>
                <div className="flex items-center gap-3">
                  {statusDisplay.icon}
                  <div>
                    <CardTitle>{statusDisplay.title}</CardTitle>
                    <CardDescription className={statusDisplay.color}>
                      {statusDisplay.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Auftrag</h3>
                    <p className="text-lg font-semibold">{order.title}</p>
                    <p className="text-sm text-gray-500">
                      {order.pickupLocation} → {order.deliveryLocation}
                    </p>
                    
                    <div className="mt-2">
                      <UserRating userId="user-1" showBadge={true} />
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-700 mb-2">Zahlungsdetails</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-sm text-gray-500">Betrag:</span>
                      <span className="text-sm font-medium">€{order.budget.toFixed(2)}</span>
                      
                      <span className="text-sm text-gray-500">Referenz:</span>
                      <span className="text-sm font-medium">{order.paymentReference || "-"}</span>
                      
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className="text-sm font-medium capitalize">
                        {paymentStatus === "reserved" ? "Vorgemerkt" : 
                         paymentStatus === "paid" ? "Bezahlt" : 
                         paymentStatus === "cancelled" ? "Storniert" : "Ausstehend"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              {paymentStatus === "reserved" && (
                <CardFooter className="flex-col space-y-4 border-t pt-4">
                  <div className="w-full flex flex-col items-center justify-center py-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Um die Zahlung freizugeben, muss die Lieferung bestätigt werden
                    </p>
                    <Button 
                      onClick={handleConfirmDelivery}
                      className="w-full"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Lieferung bestätigen
                    </Button>
                  </div>
                </CardFooter>
              )}
              
              {paymentStatus === "paid" && (
                <CardFooter className="justify-center border-t pt-4">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </CardFooter>
              )}
            </Card>
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
