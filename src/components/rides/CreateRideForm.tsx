
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Truck, Clock, Euro, Package } from "lucide-react";
import { useCreateRide } from "@/hooks/rides/useCreateRide";
import { createRideSchema, type CreateRideForm as CreateRideFormType } from "./types";

const CreateRideForm = () => {
  const navigate = useNavigate();
  const { createRide, loading } = useCreateRide();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateRideFormType>({
    resolver: zodResolver(createRideSchema),
    defaultValues: {
      flexible_time: false,
      flexible_time_hours: 0,
      vehicle_type: "pkw"
    }
  });

  const flexibleTime = watch("flexible_time");

  const onSubmit = async (data: CreateRideFormType) => {
    try {
      await createRide(data);
      navigate("/rides");
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const vehicleTypes = [
    { value: "pkw", label: "PKW" },
    { value: "kombi", label: "Kombi" },
    { value: "van", label: "Van" },
    { value: "transporter", label: "Transporter (bis 3,5t)" },
    { value: "lkw", label: "LKW (über 3,5t)" }
  ];

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Fahrt einstellen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Route Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Route
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_address">Startadresse</Label>
                  <Input
                    id="start_address"
                    {...register("start_address")}
                    placeholder="z.B. Alexanderplatz 1, Berlin"
                  />
                  {errors.start_address && (
                    <p className="text-sm text-red-600 mt-1">{errors.start_address.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="start_postal_code">PLZ Start</Label>
                  <Input
                    id="start_postal_code"
                    {...register("start_postal_code")}
                    placeholder="10178"
                  />
                  {errors.start_postal_code && (
                    <p className="text-sm text-red-600 mt-1">{errors.start_postal_code.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="end_address">Zieladresse</Label>
                  <Input
                    id="end_address"
                    {...register("end_address")}
                    placeholder="z.B. Hauptbahnhof, München"
                  />
                  {errors.end_address && (
                    <p className="text-sm text-red-600 mt-1">{errors.end_address.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="end_postal_code">PLZ Ziel</Label>
                  <Input
                    id="end_postal_code"
                    {...register("end_postal_code")}
                    placeholder="80335"
                  />
                  {errors.end_postal_code && (
                    <p className="text-sm text-red-600 mt-1">{errors.end_postal_code.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Timing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Zeitplan
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure_time">Abfahrtszeit</Label>
                  <Input
                    id="departure_time"
                    type="datetime-local"
                    {...register("departure_time")}
                  />
                  {errors.departure_time && (
                    <p className="text-sm text-red-600 mt-1">{errors.departure_time.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="arrival_time">Ankunftszeit (optional)</Label>
                  <Input
                    id="arrival_time"
                    type="datetime-local"
                    {...register("arrival_time")}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="flexible_time"
                  checked={flexibleTime}
                  onCheckedChange={(checked) => setValue("flexible_time", !!checked)}
                />
                <Label htmlFor="flexible_time">Flexible Zeiten</Label>
              </div>

              {flexibleTime && (
                <div>
                  <Label htmlFor="flexible_time_hours">Flexibilität (Stunden)</Label>
                  <Input
                    id="flexible_time_hours"
                    type="number"
                    min="0"
                    max="24"
                    {...register("flexible_time_hours", { valueAsNumber: true })}
                    placeholder="2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    ±{watch("flexible_time_hours") || 0} Stunden Flexibilität
                  </p>
                </div>
              )}
            </div>

            {/* Vehicle & Capacity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Fahrzeug & Kapazität
              </h3>

              <div>
                <Label htmlFor="vehicle_type">Fahrzeugtyp</Label>
                <Select onValueChange={(value) => setValue("vehicle_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fahrzeugtyp wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="available_capacity_kg">Ladekapazität (kg)</Label>
                  <Input
                    id="available_capacity_kg"
                    type="number"
                    min="1"
                    step="1"
                    {...register("available_capacity_kg", { valueAsNumber: true })}
                    placeholder="500"
                  />
                  {errors.available_capacity_kg && (
                    <p className="text-sm text-red-600 mt-1">{errors.available_capacity_kg.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="available_capacity_m3">Ladevolumen (m³)</Label>
                  <Input
                    id="available_capacity_m3"
                    type="number"
                    min="0.1"
                    step="0.1"
                    {...register("available_capacity_m3", { valueAsNumber: true })}
                    placeholder="2.5"
                  />
                  {errors.available_capacity_m3 && (
                    <p className="text-sm text-red-600 mt-1">{errors.available_capacity_m3.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Euro className="h-4 w-4" />
                Preisgestaltung
              </h3>

              <div>
                <Label htmlFor="price_per_kg">Preis pro kg (€)</Label>
                <Input
                  id="price_per_kg"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("price_per_kg", { valueAsNumber: true })}
                  placeholder="1.50"
                />
                {errors.price_per_kg && (
                  <p className="text-sm text-red-600 mt-1">{errors.price_per_kg.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Zusätzliche Informationen (optional)</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Besondere Hinweise, Einschränkungen, etc."
                rows={3}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/rides")}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Erstelle Fahrt..." : "Fahrt veröffentlichen"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRideForm;
