
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateRide } from "@/hooks/rides/useCreateRide";
import { createRideSchema, type CreateRideForm } from "./types";
import { useNavigate } from "react-router-dom";

const CreateRideForm = () => {
  const navigate = useNavigate();
  const { createRide, loading } = useCreateRide();

  const form = useForm<CreateRideForm>({
    resolver: zodResolver(createRideSchema),
    defaultValues: {
      flexible_time: false,
      flexible_time_hours: 0,
      available_capacity_kg: 50,
      available_capacity_m3: 1,
      price_per_kg: 1
    }
  });

  const onSubmit = async (data: CreateRideForm) => {
    try {
      await createRide(data);
      navigate("/dashboard/driver");
    } catch (error) {
      // Error handling is done in useCreateRide
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Neue Fahrt einstellen</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Route Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Route</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Startadresse</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. Hauptstraße 1, Berlin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="start_postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PLZ Start</FormLabel>
                        <FormControl>
                          <Input placeholder="10115" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="end_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zieladresse</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. Marktplatz 5, Hamburg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PLZ Ziel</FormLabel>
                        <FormControl>
                          <Input placeholder="20095" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Timing Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Termine</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="departure_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abfahrt</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="arrival_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ankunft (optional)</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="flexible_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Flexible Zeiten</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Bin zeitlich flexibel
                          </div>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("flexible_time") && (
                    <FormField
                      control={form.control}
                      name="flexible_time_hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Flexibilität (Stunden)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="24"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Vehicle & Capacity Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fahrzeug & Kapazität</h3>
                
                <FormField
                  control={form.control}
                  name="vehicle_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fahrzeugtyp</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Fahrzeugtyp auswählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pkw">PKW</SelectItem>
                          <SelectItem value="kombi">Kombi</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="transporter">Transporter</SelectItem>
                          <SelectItem value="lkw">LKW</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="available_capacity_kg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kapazität (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="available_capacity_m3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Volumen (m³)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0.1"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price_per_kg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preis (€/kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Zusätzliche Informationen</h3>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beschreibung (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Besondere Hinweise, Einschränkungen, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/driver")}
                  className="flex-1"
                >
                  Abbrechen
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Wird erstellt..." : "Fahrt veröffentlichen"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRideForm;
