
import { ArrowRight, Star, Clock, Package, Shield, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Transport } from "@/data/mockData";
import { Link } from "react-router-dom";

interface TransportCardProps {
  transport: Transport;
}

const TransportCard = ({ transport }: TransportCardProps) => {
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">
                {transport.from} <ArrowRight className="inline h-4 w-4 mx-1" /> {transport.to}
              </h3>
              {transport.driver.verified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Shield className="h-3 w-3 mr-1" /> Verified
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-gray-500 mb-3">
              <span className="font-medium">{new Date(transport.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span> • 
              <span className="ml-1">{transport.departureTime} - {transport.arrivalTime}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xl font-semibold text-brand-purple">€{transport.price}</div>
            <div className="text-xs text-gray-500">per package</div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="flex items-start">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
              <img 
                src={transport.driver.avatar} 
                alt={transport.driver.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{transport.driver.name}</div>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="ml-1 text-sm text-gray-700">{transport.driver.rating}</span>
                </div>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">{transport.driver.totalRides} rides</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="flex items-center text-sm text-gray-600">
            <Car className="h-4 w-4 mr-1 text-gray-400" />
            <span>{transport.vehicle.model}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Package className="h-4 w-4 mr-1 text-gray-400" />
            <span>Up to {transport.availableSpace.weight}kg</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 col-span-2">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            <span>{transport.availableSpace.dimensions}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <div className="text-sm font-medium text-gray-500">
          Leaves in {Math.floor(Math.random() * 12 + 1)} hours
        </div>
        <Link to={`/transport/${transport.id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </div>
    </div>
  );
};

export default TransportCard;
