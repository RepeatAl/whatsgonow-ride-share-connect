
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type ItemDetails = {
  title: string;
  description?: string;
  imageUrl?: string;
  orderId?: string;
};

export function useItemDetails(initialData?: ItemDetails) {
  const { user } = useAuth();
  const [itemData, setItemData] = useState<ItemDetails>(initialData || {
    title: "",
    description: "",
    imageUrl: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateItemField = (field: keyof ItemDetails, value: any) => {
    setItemData(prev => ({ ...prev, [field]: value }));
  };

  const setImageUrl = (url: string) => {
    updateItemField("imageUrl", url);
  };

  const resetForm = () => {
    setItemData({
      title: "",
      description: "",
      imageUrl: "",
    });
  };

  const saveItem = async (orderId: string): Promise<boolean> => {
    if (!user) {
      toast.error("Sie müssen angemeldet sein, um Artikel zu speichern");
      return false;
    }

    if (!itemData.title) {
      toast.error("Bitte geben Sie einen Titel ein");
      return false;
    }

    if (!orderId) {
      toast.error("Keine Auftrags-ID vorhanden");
      return false;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from("order_items")
        .insert({
          order_id: orderId,
          title: itemData.title,
          description: itemData.description,
          image_url: itemData.imageUrl
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Artikel gespeichert");
      resetForm();
      return true;
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Fehler beim Speichern des Artikels");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    itemData,
    updateItemField,
    setImageUrl,
    resetForm,
    saveItem,
    isSubmitting
  };
}
