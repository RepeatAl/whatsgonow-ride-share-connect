
import { Progress } from "@/components/ui/progress";
import { MapPin, Truck, CheckCircle2 } from "lucide-react";
import { TrackingStatus } from "@/pages/Tracking";

interface StatusProgressProps {
  currentStatus: TrackingStatus;
}

const StatusProgress = ({ currentStatus }: StatusProgressProps) => {
  const getProgressValue = () => {
    switch (currentStatus) {
      case "pickup": return 33;
      case "transit": return 66;
      case "delivered": return 100;
      default: return 0;
    }
  };

  return (
    <div className="space-y-4">
      <Progress value={getProgressValue()} className="h-2" />
      
      <div className="flex justify-between mt-4">
        <div className={`flex flex-col items-center ${currentStatus === "pickup" ? "text-brand-primary font-semibold" : "text-gray-700"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
            currentStatus === "pickup" ? "bg-brand-primary text-white" : 
            (currentStatus === "transit" || currentStatus === "delivered") ? "bg-green-100 text-green-600" : "bg-gray-100"
          }`}>
            <MapPin className="h-4 w-4" />
          </div>
          <span className="text-xs text-center">Abholung</span>
        </div>
        
        <div className={`flex flex-col items-center ${currentStatus === "transit" ? "text-brand-primary font-semibold" : "text-gray-700"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
            currentStatus === "transit" ? "bg-brand-primary text-white" : 
            currentStatus === "delivered" ? "bg-green-100 text-green-600" : "bg-gray-100"
          }`}>
            <Truck className="h-4 w-4" />
          </div>
          <span className="text-xs text-center">Unterwegs</span>
        </div>
        
        <div className={`flex flex-col items-center ${currentStatus === "delivered" ? "text-brand-primary font-semibold" : "text-gray-700"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
            currentStatus === "delivered" ? "bg-brand-primary text-white" : "bg-gray-100"
          }`}>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <span className="text-xs text-center">Zugestellt</span>
        </div>
      </div>
    </div>
  );
};

export default StatusProgress;
