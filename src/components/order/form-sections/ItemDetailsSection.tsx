
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/validators/order";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemDetailsUpload } from "./ItemDetailsUpload";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ItemDetailsSectionProps {
  form: UseFormReturn<CreateOrderFormValues>;
  insuranceEnabled: boolean;
  orderId?: string;
  onAddItem?: (item: any) => void;
}

export const ItemDetailsSection = ({ 
  form, 
  insuranceEnabled, 
  orderId, 
  onAddItem 
}: ItemDetailsSectionProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [showItemUpload, setShowItemUpload] = useState(false);
  
  // Wenn der Benutzer eingeloggt ist und eine Sender-Rolle hat, zeigen wir den erweiterten Upload an
  useEffect(() => {
    if (user) {
      // Check if user has a sender role (sender_private, sender_business)
      const isSender = user.role?.includes("sender_");
      setShowItemUpload(isSender);
    } else {
      setShowItemUpload(false);
    }
  }, [user]);

  const handleAddItem = (item: any) => {
    if (onAddItem) {
      onAddItem(item);
    }
    setActiveTab("basic");
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Artikeldetails</h3>
      
      {showItemUpload ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="basic">Basis-Infos</TabsTrigger>
            <TabsTrigger value="details">Detaillierte Beschreibung</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artikelname*</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Sofa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategorie*</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Möbel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gewicht (kg)*</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="z.B. 15.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {insuranceEnabled ? "Warenwert (€)*" : "Warenwert (€, optional)"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="z.B. 499.99" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3 mt-4">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breite (cm)*</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="z.B. 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Höhe (cm)*</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="z.B. 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="depth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiefe (cm)*</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="z.B. 30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {user && (
              <div className="mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab("details")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Erweiterte Beschreibung & Foto hinzufügen
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details">
            <ItemDetailsUpload 
              onSaveItem={handleAddItem} 
              orderId={orderId}
            />
          </TabsContent>
        </Tabs>
      ) : (
        // Standardformular für nicht eingeloggte oder nicht-Sender-Nutzer
        <div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artikelname*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Sofa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategorie*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Möbel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gewicht (kg)*</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="z.B. 15.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {insuranceEnabled ? "Warenwert (€)*" : "Warenwert (€, optional)"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="z.B. 499.99" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breite (cm)*</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="z.B. 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Höhe (cm)*</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="z.B. 50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="depth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiefe (cm)*</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="z.B. 30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};
