
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Truck, Euro } from "lucide-react";
import type { Ride } from "./types";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface RideCardProps {
  ride: Ride;
  onEdit?: (rideId: string) => void;
  onDelete?: (rideId: string) => void;
  showActions?: boolean;
}

const RideCard: React.FC<RideCardProps> = ({
  ride,
  onEdit,
  onDelete,
  showActions = true
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Veröffentlicht';
      case 'booked': return 'Gebucht';
      case 'completed': return 'Abgeschlossen';
      case 'cancelled': return 'Storniert';
      default: return status;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{ride.start_postal_code} → {ride.end_postal_code}</span>
            </div>
            <h3 className="font-semibold truncate">
              {ride.start_address} → {ride.end_address}
            </h3>
          </div>
          <Badge className={getStatusColor(ride.status)}>
            {getStatusText(ride.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Timing */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(new Date(ride.departure_time), "dd.MM.yyyy 'um' HH:mm", { locale: de })}
          </span>
          {ride.flexible_time && ride.flexible_time_hours > 0 && (
            <Badge variant="secondary" className="text-xs">
              ±{ride.flexible_time_hours}h flexibel
            </Badge>
          )}
        </div>

        {/* Vehicle & Capacity */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{ride.vehicle_type || 'PKW'}</span>
          </div>
          <div className="text-muted-foreground">
            {ride.available_capacity_kg}kg • {ride.available_capacity_m3}m³
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 text-sm">
          <Euro className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {ride.price_per_kg}€/kg
          </span>
        </div>

        {/* Description */}
        {ride.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {ride.description}
          </p>
        )}

        {/* Actions */}
        {showActions && (onEdit || onDelete) && (
          <div className="flex gap-2 pt-2 border-t">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(ride.id)}
                className="flex-1"
              >
                Bearbeiten
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onDelete(ride.id)}
                className="flex-1"
              >
                Löschen
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RideCard;
