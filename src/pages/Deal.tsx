
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ArrowLeft, 
  Navigation, 
  Clock, 
  Truck, 
  CheckCircle2,
  BadgeDollarSign,
  QrCode
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransportRequest } from "@/data/mockData";
import ChatInterface from "@/components/chat/ChatInterface";
import RouteMap from "@/components/map/RouteMap";
import StatusUpdateButtons from "@/components/tracking/StatusUpdateButtons";
import { TrackingStatus } from "@/pages/Tracking";
import { paymentService } from "@/services/paymentService";
import { PaymentStatus } from "@/types/payment";
import QRCode from "@/components/payment/QRCode";

const Deal = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<TransportRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<TrackingStatus>("pickup");
  const [statusUpdateTime, setStatusUpdateTime] = useState<Date | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");
  
  // Fetch order details
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call to get order details
    import('@/data/mockData').then(({ mockRequests }) => {
      const selectedOrder = mockRequests.find(req => req.id === orderId);
      if (selectedOrder) {
        setOrder(selectedOrder);
        // Generate QR code value for delivery confirmation
        const qrValue = `delivery-confirm:${selectedOrder.id}:${Date.now()}`;
        setQrCodeValue(qrValue);
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

  const handleStatusUpdate = (newStatus: TrackingStatus) => {
    setStatus(newStatus);
    setStatusUpdateTime(new Date());
    
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

    // Simulate WebSocket update notification to customer
    setTimeout(() => {
      toast({
        title: "Kundenmitteilung",
        description: `Der Kunde wurde über den neuen Status "${statusText}" informiert.`,
      });
    }, 1500);
    
    // Show QR code when delivery is marked as complete
    if (newStatus === "delivered") {
      setShowQRCode(true);
    }
  };

  // Handle payment reservation
  const handleReservePayment = async () => {
    if (!order) return;
    
    setIsProcessingPayment(true);
    try {
      // Simulate payment reservation
      const result = await paymentService.reservePayment(order.id, order.budget);
      
      if (result.success) {
        // Update order locally with new payment status and reference
        const updatedOrder = { 
          ...order, 
          paymentStatus: result.status as PaymentStatus,
          paymentReference: result.reference
        };
        setOrder(updatedOrder);
        
        // Show success message
        toast({
          title: "Zahlung vorgemerkt",
          description: "Die Zahlung wurde erfolgreich vorgemerkt. Sie wird nach Lieferung freigegeben.",
        });
        
        // Navigate to payment status page
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
  
  // QR code scan handler
  const handleQRScan = async (value: string) => {
    if (!order || !order.paymentReference) return;
    
    setIsProcessingPayment(true);
    try {
      // Simulate payment release
      const result = await paymentService.releasePayment(order.paymentReference);
      
      if (result.success) {
        // Update order locally
        setOrder(prev => prev ? { ...prev, paymentStatus: "paid" } : null);
        
        // Show success message
        toast({
          title: "Lieferung bestätigt",
          description: "Die Lieferung wurde erfolgreich bestätigt und die Zahlung freigegeben.",
        });
        
        // Close QR code view after success
        setShowQRCode(false);
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

  // Status badge style based on current status
  const getStatusBadgeClass = () => {
    switch(status) {
      case "pickup": return "bg-blue-100 text-blue-800";
      case "transit": return "bg-yellow-100 text-yellow-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Status icon based on current status
  const StatusIcon = () => {
    switch(status) {
      case "pickup": return <Clock className="h-4 w-4" />;
      case "transit": return <Truck className="h-4 w-4" />;
      case "delivered": return <CheckCircle2 className="h-4 w-4" />;
      default: return null;
    }
  };
  
  // Get payment status button based on current payment status
  const getPaymentButton = () => {
    if (!order) return null;
    
    switch (order.paymentStatus) {
      case "reserved":
        return (
          <Button 
            onClick={handleViewPaymentStatus}
            variant="outline"
            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <BadgeDollarSign className="h-4 w-4 mr-2" />
            Zahlung vorgemerkt
          </Button>
        );
      case "paid":
        return (
          <Button 
            onClick={handleViewPaymentStatus}
            variant="outline"
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Zahlung abgeschlossen
          </Button>
        );
      default:
        return (
          <Button 
            onClick={handleReservePayment}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verarbeitung...
              </>
            ) : (
              <>
                <BadgeDollarSign className="h-4 w-4 mr-2" />
                Zahlung vormerkenn
              </>
            )}
          </Button>
        );
    }
  };

  // Format status update time
  const formatUpdateTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                  <div className="flex gap-2 mt-2">
                    <Button 
                      onClick={handleStartTracking}
                      size="sm"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Live-Tracking
                    </Button>
                    {getPaymentButton()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* QR code modal for delivery confirmation */}
            {showQRCode && (
              <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
                <div className="flex flex-col items-center">
                  <h2 className="text-lg font-semibold mb-3">Lieferung bestätigen</h2>
                  <p className="text-gray-600 text-center mb-4">
                    Bitten Sie den Empfänger, diesen QR-Code zu scannen, um die Lieferung zu bestätigen
                  </p>
                  
                  <div className="w-full max-w-xs">
                    <QRCode 
                      value={qrCodeValue}
                      size={200}
                      className="mx-auto"
                      onScan={handleQRScan}
                      allowScan={true}
                    />
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={() => setShowQRCode(false)}
                      variant="outline"
                    >
                      Schließen
                    </Button>
                    <Button 
                      onClick={() => handleQRScan(qrCodeValue)}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Verarbeitung...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Manuell bestätigen
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
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
                  <p className="text-sm text-gray-600 mt-2">Gewicht: {order.itemDetails.weight} kg</p>
                  <p className="text-sm text-gray-600">Dimensionen: {order.itemDetails.dimensions}</p>
                  <p className="text-sm text-gray-600">Abholzeitfenster: {order.pickupTimeWindow.start} - {order.pickupTimeWindow.end}</p>
                </div>
                <div className="flex justify-between">
                  <Button 
                    onClick={() => setShowQRCode(true)}
                    variant="outline"
                    size="sm"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    QR-Code anzeigen
                  </Button>
                  <Button 
                    onClick={handleStartTracking}
                    variant="outline"
                    size="sm"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Live-Tracking starten
                  </Button>
                </div>
              </div>
            </div>

            {/* Status section */}
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-gray-800 mb-2">Auftragsstatus</h2>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass()}`}>
                      <StatusIcon />
                      <span className="ml-1">
                        {{
                          pickup: "Abholung",
                          transit: "Unterwegs",
                          delivered: "Zugestellt"
                        }[status]}
                      </span>
                    </span>
                    {statusUpdateTime && (
                      <span className="text-xs text-gray-500 ml-2">
                        Aktualisiert um {formatUpdateTime(statusUpdateTime)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <StatusUpdateButtons
                    currentStatus={status}
                    onStatusUpdate={handleStatusUpdate}
                  />
                </div>
              </div>
            </div>

            <ChatInterface orderId={orderId as string} order={order} currentStatus={status} />
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
