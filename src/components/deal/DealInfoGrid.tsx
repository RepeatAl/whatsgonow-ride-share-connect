
import { QrCode, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import RouteMap from "@/components/map/RouteMap";
import { TransportRequest } from "@/data/mockData";

interface DealInfoGridProps {
  order: TransportRequest;
  handleStartTracking: () => void;
  setShowQRCode: (show: boolean) => void;
}

export const DealInfoGrid = ({
  order,
  handleStartTracking,
  setShowQRCode,
}: DealInfoGridProps) => {
  return (
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
  );
};
