
import { 
  Package, 
  MessageSquare, 
  Star, 
  TruckIcon,
  ShoppingBag,
  User
} from "lucide-react";

interface ActivityIconProps {
  type: string;
  status?: string;
}

const ActivityIcon = ({ type, status }: ActivityIconProps) => {
  switch (type) {
    case "order":
      if (status === "completed") {
        return <TruckIcon className="h-4 w-4 text-green-500" />;
      } else if (status === "cancelled") {
        return <Package className="h-4 w-4 text-red-500" />;
      }
      return <Package className="h-4 w-4 text-blue-500" />;
    case "offer":
      return <ShoppingBag className="h-4 w-4 text-purple-500" />;
    case "rating":
      return <Star className="h-4 w-4 text-amber-500" />;
    case "transaction":
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    default:
      return <User className="h-4 w-4 text-gray-500" />;
  }
};

export default ActivityIcon;
