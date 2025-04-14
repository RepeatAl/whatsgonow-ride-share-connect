import { useNavigate } from "react-router-dom";
import { ArrowLeft, BadgeDollarSign, CheckCircle2, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransportRequest } from "@/data/mockData";
import UserRating from "@/components/rating/UserRating";

interface DealHeaderProps {
  order: TransportRequest;
  isProcessingPayment: boolean;
  handleReservePayment: () => void;
  handleViewPaymentStatus: () => void;
  handleStartTracking: () => void;
}

export const DealHeader = ({
  order,
  isProcessingPayment,
  handleReservePayment,
  handleViewPaymentStatus,
  handleStartTracking,
}: DealHeaderProps) => {
  const navigate = useNavigate();

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

  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 w-fit" 
        onClick={() => navigate("/offer-transport")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zurück zur Übersicht
      </Button>

      <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{order.title}</h1>
            <div className="mt-2 text-sm text-gray-600">
              {order.pickupLocation} → {order.deliveryLocation}
            </div>
            
            <div className="mt-2">
              <UserRating userId="user-1" showBadge={true} />
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
    </>
  );
};
