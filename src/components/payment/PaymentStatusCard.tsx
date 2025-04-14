
import React from "react";
import { CheckCircle2, CreditCard, QrCode, AlertTriangle, BadgeDollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentStatus } from "@/types/payment";
import UserRating from "@/components/rating/UserRating";
import { TransportRequest } from "@/data/mockData";

interface PaymentStatusCardProps {
  order: TransportRequest;
  paymentStatus: PaymentStatus;
  onConfirmDelivery: () => void;
}

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  order,
  paymentStatus,
  onConfirmDelivery,
}) => {
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
              onClick={onConfirmDelivery}
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
  );
};

export default PaymentStatusCard;
