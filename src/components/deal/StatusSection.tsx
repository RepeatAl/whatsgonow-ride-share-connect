
import { Clock, Truck, CheckCircle2 } from "lucide-react";
import StatusUpdateButtons from "@/components/tracking/StatusUpdateButtons";
import { TrackingStatus } from "@/pages/Tracking";

interface StatusSectionProps {
  status: TrackingStatus;
  statusUpdateTime: Date | null;
  onStatusUpdate: (newStatus: TrackingStatus) => void;
}

export const StatusSection = ({
  status,
  statusUpdateTime,
  onStatusUpdate,
}: StatusSectionProps) => {
  const getStatusBadgeClass = () => {
    switch(status) {
      case "pickup": return "bg-blue-100 text-blue-800";
      case "transit": return "bg-yellow-100 text-yellow-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const StatusIcon = () => {
    switch(status) {
      case "pickup": return <Clock className="h-4 w-4" />;
      case "transit": return <Truck className="h-4 w-4" />;
      case "delivered": return <CheckCircle2 className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatUpdateTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-gray-800 mb-2">Auftragsstatus</h2>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass()}`}>
              <StatusIcon />
              <span className="ml-1">
                {{
                  pickup: "Abholung",
                  transit: "Unterwegs",
                  delivered: "Zugestellt"
                }[status]}
              </span>
            </span>
            {statusUpdateTime && (
              <span className="text-xs text-gray-500 ml-2">
                Aktualisiert um {formatUpdateTime(statusUpdateTime)}
              </span>
            )}
          </div>
        </div>
        <div>
          <StatusUpdateButtons
            currentStatus={status}
            onStatusUpdate={onStatusUpdate}
          />
        </div>
      </div>
    </div>
  );
};
