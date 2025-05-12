
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { ItemDetails } from "./useItemDetails";

export function useOrderItems(initialItems: ItemDetails[] = []) {
  const [items, setItems] = useState<ItemDetails[]>(initialItems);
  const [isProcessing, setIsProcessing] = useState(false);

  // Artikel zur Liste hinzufügen
  const addItem = (item: ItemDetails) => {
    setItems(prevItems => [...prevItems, item]);
    toast.success("Artikel hinzugefügt");
  };

  // Artikel aus der Liste entfernen
  const removeItem = (index: number) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
    toast.success("Artikel entfernt");
  };

  // Alle Artikel zurücksetzen
  const resetItems = () => {
    setItems([]);
  };

  // Alle Artikel für einen Auftrag speichern
  const saveAllItems = async (orderId: string): Promise<boolean> => {
    if (!items.length) {
      return true; // Keine Artikel zum Speichern
    }

    setIsProcessing(true);

    try {
      // Vorbereiten der Artikel für die Datenbank
      const itemsToSave = items.map(item => ({
        order_id: orderId,
        title: item.title,
        description: item.description,
        image_url: item.image_url
      }));

      // Einfügen der Artikel in die Datenbank
      const { error } = await supabase
        .from("order_items")
        .insert(itemsToSave);

      if (error) throw error;

      toast.success("Alle Artikel wurden gespeichert");
      return true;
    } catch (error) {
      console.error("Fehler beim Speichern der Artikel:", error);
      toast.error("Fehler beim Speichern der Artikel");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    items,
    addItem,
    removeItem,
    resetItems,
    saveAllItems,
    isProcessing
  };
}
