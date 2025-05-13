
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export interface ItemDetails {
  id?: string;
  title: string;
  description?: string;
  image_url?: string;  // Konsistent image_url statt imageUrl verwenden
  analysis_status?: 'pending' | 'success' | 'failed';
  category_suggestion?: string;
  labels_raw?: Record<string, number>;
}

export function useItemDetails(orderId?: string) {
  const [items, setItems] = useState<ItemDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Fehler beim Laden der Artikel:", error);
      toast.error("Die Artikel konnten nicht geladen werden");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const saveItem = async (item: ItemDetails) => {
    if (!orderId) {
      toast.error("Keine Auftrags-ID vorhanden");
      return null;
    }

    setIsSaving(true);
    try {
      const itemData = {
        ...item,
        order_id: orderId,
      };

      const { data, error } = await supabase
        .from("order_items")
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [...prev, data]);
      toast.success("Artikel wurde gespeichert");
      return data;
    } catch (error) {
      console.error("Fehler beim Speichern des Artikels:", error);
      toast.error("Der Artikel konnte nicht gespeichert werden");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const updateItemAnalysis = async (itemId: string, analysisData: any) => {
    try {
      const { error } = await supabase
        .from("order_items")
        .update({
          category_suggestion: analysisData.results.categoryGuess,
          labels_raw: analysisData.results.labels,
          analysis_status: "success"
        })
        .eq("item_id", itemId);

      if (error) throw error;
      
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              category_suggestion: analysisData.results.categoryGuess,
              labels_raw: analysisData.results.labels,
              analysis_status: "success"
            } 
          : item
      ));
      
      return true;
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Analyse:", error);
      toast.error("Die Analyseergebnisse konnten nicht aktualisiert werden");
      return false;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("order_items")
        .delete()
        .eq("item_id", itemId);

      if (error) throw error;
      
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast.success("Artikel wurde entfernt");
      return true;
    } catch (error) {
      console.error("Fehler beim Entfernen des Artikels:", error);
      toast.error("Der Artikel konnte nicht entfernt werden");
      return false;
    }
  };

  // Fügt einen Artikel lokal hinzu (ohne Speichern in DB)
  const addItem = (item: ItemDetails) => {
    const newItem = {
      ...item,
      id: item.id || uuidv4()
    };
    setItems(prev => [...prev, newItem]);
    return newItem;
  };

  // Speichert alle lokal hinzugefügten Artikel
  const saveAllItems = async (targetOrderId?: string) => {
    const orderIdToUse = targetOrderId || orderId;
    if (!orderIdToUse) {
      toast.error("Keine Auftrags-ID vorhanden");
      return false;
    }

    const itemsToSave = items.filter(item => !item.id?.includes("-"));
    if (itemsToSave.length === 0) return true;

    setIsSaving(true);
    try {
      const itemsWithOrderId = itemsToSave.map(item => ({
        ...item,
        order_id: orderIdToUse
      }));

      const { error } = await supabase
        .from("order_items")
        .insert(itemsWithOrderId);

      if (error) throw error;
      
      toast.success("Alle Artikel wurden gespeichert");
      return true;
    } catch (error) {
      console.error("Fehler beim Speichern der Artikel:", error);
      toast.error("Die Artikel konnten nicht gespeichert werden");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    items,
    isLoading,
    isSaving,
    fetchItems,
    saveItem,
    addItem,
    removeItem,
    saveAllItems,
    updateItemAnalysis
  };
}
