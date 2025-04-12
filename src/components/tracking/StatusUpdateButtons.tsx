
import { Button } from "@/components/ui/button";
import { MapPin, Truck, CheckCircle2 } from "lucide-react";
import { TrackingStatus } from "@/pages/Tracking";

interface StatusUpdateButtonsProps {
  currentStatus: TrackingStatus;
  onStatusUpdate: (status: TrackingStatus) => void;
}

const StatusUpdateButtons = ({ currentStatus, onStatusUpdate }: StatusUpdateButtonsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={currentStatus === "pickup" ? "default" : "outline"}
        className="justify-start"
        onClick={() => onStatusUpdate("pickup")}
        disabled={currentStatus !== "pickup" && currentStatus !== "transit"}
      >
        <MapPin className="h-4 w-4 mr-2" />
        Abholung
      </Button>
      
      <Button
        variant={currentStatus === "transit" ? "default" : "outline"}
        className="justify-start"
        onClick={() => onStatusUpdate("transit")}
        disabled={currentStatus === "delivered"}
      >
        <Truck className="h-4 w-4 mr-2" />
        Unterwegs
      </Button>
      
      <Button
        variant={currentStatus === "delivered" ? "default" : "outline"}
        className="justify-start"
        onClick={() => onStatusUpdate("delivered")}
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Zugestellt
      </Button>
      
      <p className="text-xs text-gray-500 mt-2">
        Klicken Sie auf einen Status, um die Sendungsverfolgung zu aktualisieren.
      </p>
    </div>
  );
};

export default StatusUpdateButtons;
