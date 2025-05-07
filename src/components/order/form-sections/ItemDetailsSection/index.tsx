
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { ItemDetailsSectionProps } from "./types";
import { ItemForm } from "./ItemForm";
import { ItemList } from "./ItemList";

export function ItemDetailsSection({ 
  form, 
  insuranceEnabled, 
  orderId, 
  items = [],
  onAddItem,
  onRemoveItem
}: ItemDetailsSectionProps) {
  const { user } = useAuth();
  const [showItemForm, setShowItemForm] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>("basic-info");
  
  // Wenn der Benutzer eingeloggt ist und eine Sender-Rolle hat, zeigen wir den erweiterten Upload an
  useEffect(() => {
    if (user) {
      // Check if user has a sender role (sender_private, sender_business)
      const isSender = user.role?.includes("sender_");
      if (!isSender) {
        setShowItemForm(false);
      }
    } else {
      setShowItemForm(false);
    }
  }, [user]);

  const handleAddItem = (item: any) => {
    if (onAddItem) {
      onAddItem(item);
    }
    setActiveAccordion("basic-info");
    setShowItemForm(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Artikeldetails</h3>
      
      <Accordion 
        type="single" 
        collapsible
        value={activeAccordion}
        onValueChange={setActiveAccordion}
        className="w-full"
      >
        <AccordionItem value="basic-info">
          <AccordionTrigger>Basis-Informationen</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-2 pt-2">
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
          </AccordionContent>
        </AccordionItem>

        {user && (
          <AccordionItem value="additional-items">
            <AccordionTrigger>Weitere Artikel hinzufügen</AccordionTrigger>
            <AccordionContent>
              {showItemForm ? (
                <ItemForm 
                  onSaveItem={handleAddItem} 
                  orderId={orderId}
                />
              ) : (
                <div className="flex justify-center py-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowItemForm(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Neuen Artikel hinzufügen
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
      
      {/* Liste der bereits hinzugefügten Artikel */}
      {items.length > 0 && (
        <div className="mt-6">
          <ItemList items={items} onRemoveItem={onRemoveItem || (() => {})} />
        </div>
      )}
    </div>
  );
}

// Exportiere die Subkomponenten für die Wiederverwendung in anderen Bereichen
export { ItemForm } from "./ItemForm";
export { ItemList } from "./ItemList";
export { ItemPreviewCard } from "./ItemPreviewCard";
export type { ItemDetails, ItemDetailsSectionProps } from "./types";
