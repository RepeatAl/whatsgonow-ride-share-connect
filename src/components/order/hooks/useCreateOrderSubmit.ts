
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export const useCreateOrderSubmit = (clearDraft: () => Promise<boolean>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFindDriverDialog, setShowFindDriverDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const userId = user?.id;

  const handleCreateOrder = async (formData: any, photoUrls: string[] = []): Promise<string | undefined> => {
    try {
      if (!user) {
        toast.error("Sie müssen angemeldet sein, um einen Auftrag zu erstellen");
        navigate("/login");
        return;
      }
      
      setIsSubmitting(true);
      
      // Formatiere die Daten für die Datenbank
      const orderData = {
        description: formData.description || formData.title,
        from_address: `${formData.pickupStreet} ${formData.pickupHouseNumber}, ${formData.pickupPostalCode} ${formData.pickupCity}, ${formData.pickupCountry}`,
        to_address: `${formData.deliveryStreet} ${formData.deliveryHouseNumber}, ${formData.deliveryPostalCode} ${formData.deliveryCity}, ${formData.deliveryCountry}`,
        weight: formData.weight,
        price: formData.price || 0,
        negotiable: formData.negotiable || false,
        fragile: formData.fragile || false,
        load_assistance: formData.loadAssistance || false,
        tools_required: formData.toolsRequired || "",
        security_measures: formData.securityMeasures || "",
        category: formData.category || "",
        preferred_vehicle_type: formData.preferredVehicleType || "",
        item_name: formData.itemName || "",
        deadline: formData.deadline,
        status: 'open',
        sender_id: user.id
      };

      // Speichere den Auftrag in der Datenbank
      const { data: orderResponse, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('order_id')
        .single();

      if (orderError) {
        throw orderError;
      }

      console.log("Auftrag erfolgreich erstellt:", orderResponse);
      
      // Verknüpfe die hochgeladenen Fotos mit dem Auftrag
      if (photoUrls.length > 0) {
        // TODO: Implementieren Sie die Verknüpfung der Fotos mit dem Auftrag
        console.log("Fotos verknüpfen:", photoUrls, "mit Auftrag:", orderResponse.order_id);
      }
      
      // Lösche den Draft, nachdem alles gespeichert wurde
      await clearDraft();
      
      // Zeige Erfolgsmeldung und Dialog zur Fahrersuche
      toast.success("Auftrag erfolgreich erstellt");
      setShowFindDriverDialog(true);
      
      return orderResponse.order_id;
    } catch (error) {
      console.error('Fehler bei der Auftragserstellung:', error);
      toast.error(`Fehler beim Erstellen des Auftrags: ${(error as Error).message}`);
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFindDriverDialogClose = () => {
    setShowFindDriverDialog(false);
    // Nach Schließen des Dialogs zur Auftragsseite weiterleiten
    navigate('/orders');
  };

  return {
    handleCreateOrder,
    isSubmitting,
    userId,
    showFindDriverDialog,
    handleFindDriverDialogClose
  };
};
