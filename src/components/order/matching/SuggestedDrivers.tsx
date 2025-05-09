
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRound } from "lucide-react";
import { toast } from "sonner";
import { matchDriversToOrder, MatchedDriver } from "@/services/matching/matchDriversToOrder";

interface SuggestedDriversProps {
  orderId: string;
}

const DriverSkeleton = () => (
  <div className="rounded-2xl shadow-md p-4 flex flex-col gap-2">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-5 w-2/3 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
    <div className="flex justify-between items-center mt-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

export const SuggestedDrivers = ({ orderId }: SuggestedDriversProps) => {
  const [drivers, setDrivers] = useState<MatchedDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDrivers = async () => {
      if (!orderId) {
        setError("Keine Auftrags-ID vorhanden");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const matchedDrivers = await matchDriversToOrder(orderId);
        setDrivers(matchedDrivers);
      } catch (err) {
        console.error("Fehler beim Laden der Fahrer-Vorschläge:", err);
        setError("Fehler beim Laden der Vorschläge");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDrivers();
  }, [orderId]);
  
  const handleInvite = (driverId: string) => {
    // Platzhalter für zukünftige Funktionalität
    toast.info("Einladungsfunktion wird bald implementiert");
    console.log(`Fahrer einladen: ${driverId}`);
  };
  
  if (loading) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Passende Fahrer werden gesucht...</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <DriverSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
        <h3 className="font-medium mb-1">Fehler beim Laden</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  if (drivers.length === 0) {
    return (
      <div className="mt-6 p-6 rounded-lg border border-dashed text-center">
        <h3 className="font-medium mb-2 text-gray-700">Keine passenden Fahrer gefunden</h3>
        <p className="text-sm text-gray-500">
          Derzeit sind keine Fahrer verfügbar, die zu diesem Auftrag passen.
        </p>
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Passende Fahrer ({drivers.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drivers.map((driver) => (
          <Card 
            key={driver.user_id} 
            className="rounded-2xl shadow-md p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                {driver.profile_photo_url ? (
                  <AvatarImage 
                    src={driver.profile_photo_url} 
                    alt={driver.name || "Fahrer"} 
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback>
                  <UserRound className="w-6 h-6 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h4 className="font-semibold text-base">{driver.name || "Unbekannter Fahrer"}</h4>
                <p className="text-sm text-gray-500">{driver.region}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              {driver.match_score !== undefined && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Score: {driver.match_score}
                </Badge>
              )}
              
              <Button 
                onClick={() => handleInvite(driver.user_id)}
                className="text-sm bg-primary text-white px-3 py-1 rounded"
                size="sm"
              >
                Einladen
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuggestedDrivers;
