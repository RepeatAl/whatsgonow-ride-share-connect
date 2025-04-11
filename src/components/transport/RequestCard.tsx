
import { ArrowRight, Star, Clock, Calendar, DollarSign, Shield, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransportRequest } from "@/data/mockData";
import { Link } from "react-router-dom";

interface RequestCardProps {
  request: TransportRequest;
}

const RequestCard = ({ request }: RequestCardProps) => {
  // Parse dates
  const pickupStart = new Date(request.pickupTimeWindow.start);
  const pickupEnd = new Date(request.pickupTimeWindow.end);
  const deliveryStart = new Date(request.deliveryTimeWindow.start);
  const deliveryEnd = new Date(request.deliveryTimeWindow.end);

  const formatTimeWindow = (start: Date, end: Date) => {
    return `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`;
  };

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    matched: 'bg-blue-50 text-blue-700 border-blue-200',
    in_transit: 'bg-purple-50 text-purple-700 border-purple-200',
    completed: 'bg-green-50 text-green-700 border-green-200'
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{request.title}</h3>
              <Badge variant="outline" className={statusColors[request.status as keyof typeof statusColors]}>
                {request.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="text-sm text-gray-500 mb-3">
              {request.pickupLocation} <ArrowRight className="inline h-3 w-3 mx-1" /> {request.deliveryLocation}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xl font-semibold text-brand-primary">€{request.budget}</div>
            <div className="text-xs text-gray-500">budget</div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="flex items-start">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
              <img 
                src={request.requester.avatar} 
                alt={request.requester.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium flex items-center">
                {request.requester.name}
                {request.requester.verified && (
                  <Shield className="h-3.5 w-3.5 ml-1 text-green-500" />
                )}
              </div>
              <div className="flex items-center">
                <div className="flex text-brand-orange">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="ml-1 text-sm text-gray-700">{request.requester.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
            <span>{pickupStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            <span>{formatTimeWindow(pickupStart, pickupEnd)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
            <span>Item value: €{request.itemDetails.value}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Package className="h-4 w-4 mr-1 text-gray-400" />
            <span>{request.itemDetails.weight}kg, {request.itemDetails.dimensions}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <div className="text-sm font-medium text-gray-500">
          Posted {new Date(request.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
        <Link to={`/request/${request.id}`}>
          <Button 
            size="sm"
            className="bg-brand-primary hover:bg-brand-primary/90 text-white transition-colors"
          >
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RequestCard;
