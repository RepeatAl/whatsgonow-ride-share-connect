
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMyRides } from "@/hooks/rides/useMyRides";
import RideCard from "./RideCard";
import { toast } from "@/hooks/use-toast";

const MyRides = () => {
  const navigate = useNavigate();
  const { rides, loading, error, deleteRide } = useMyRides();

  const handleDelete = async (rideId: string) => {
    if (!confirm("Möchtest du diese Fahrt wirklich löschen?")) {
      return;
    }

    try {
      await deleteRide(rideId);
      toast({
        title: "Fahrt gelöscht",
        description: "Die Fahrt wurde erfolgreich entfernt."
      });
    } catch (error) {
      toast({
        title: "Fehler beim Löschen",
        description: "Die Fahrt konnte nicht gelöscht werden.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (rideId: string) => {
    navigate(`/rides/${rideId}/edit`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Fehler beim Laden: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meine Fahrten</h1>
        <Button onClick={() => navigate("/rides/create")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Neue Fahrt
        </Button>
      </div>

      {rides.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Noch keine Fahrten</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Du hast noch keine Fahrten eingestellt. Erstelle deine erste Fahrt und beginne mit dem Transport von Sendungen.
            </p>
            <Button onClick={() => navigate("/rides/create")}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Erste Fahrt erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRides;
