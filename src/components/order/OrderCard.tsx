
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Package, 
  Calendar, 
  Clock, 
  ChevronRight 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Order } from "@/hooks/use-orders";

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.description}</CardTitle>
            <CardDescription>
              <span className="inline-flex items-center gap-0.5">
                <Package className="h-3.5 w-3.5" /> {order.weight} kg
              </span>
            </CardDescription>
          </div>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
            {order.status}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-gray-700">{order.from_address}</div>
              <div className="text-sm text-gray-700 mt-1 flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {order.to_address}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{formatDate(order.deadline)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{formatTime(order.deadline)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant="brand"
          onClick={() => navigate(`/submit-offer/${order.order_id}`)}
        >
          Angebot abgeben
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
