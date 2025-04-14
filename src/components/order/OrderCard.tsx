
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/hooks/use-sender-orders";
import { formatDate } from "@/utils/pdfGenerator";
import { MapPin, Calendar, Package, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderReceiptButton from "./OrderReceiptButton";

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
}

const OrderCard = ({ order, showActions = true }: OrderCardProps) => {
  const navigate = useNavigate();
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "offen": return "secondary";
      case "matched": return "default";
      case "unterwegs": return "outline";
      case "abgeschlossen": return "default";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "offen": return "Offen";
      case "matched": return "Zugeordnet";
      case "unterwegs": return "Unterwegs";
      case "abgeschlossen": return "Abgeschlossen";
      default: return status;
    }
  };
  
  const handleViewDetails = () => {
    navigate(`/deal/${order.order_id}`);
  };

  const isCompleted = order.status === "abgeschlossen";
  const userEmail = "user@example.com"; // In a real app, get from auth context or user data

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="px-4 py-3 flex flex-row justify-between items-center">
        <div className="font-medium truncate flex-1">
          {order.description}
        </div>
        <Badge variant={getBadgeVariant(order.status)}>
          {getStatusLabel(order.status)}
        </Badge>
      </CardHeader>
      <CardContent className="px-4 py-3 space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
          <div className="flex-1">
            <div className="text-gray-600">Von:</div>
            <div>{order.from_address}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
          <div className="flex-1">
            <div className="text-gray-600">Nach:</div>
            <div>{order.to_address}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
          <div className="flex-1">
            <div className="text-gray-600">Lieferfrist:</div>
            <div>{formatDate(order.deadline)}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Package className="w-4 h-4 text-gray-500 mt-0.5" />
          <div className="flex-1">
            <div className="text-gray-600">Gewicht:</div>
            <div>{order.weight} kg</div>
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <>
          <Separator />
          <CardFooter className="px-4 py-3 flex justify-between">
            <OrderReceiptButton 
              orderId={order.order_id}
              isCompleted={isCompleted}
              userEmail={userEmail}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary ml-auto"
              onClick={handleViewDetails}
            >
              Details <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default OrderCard;
