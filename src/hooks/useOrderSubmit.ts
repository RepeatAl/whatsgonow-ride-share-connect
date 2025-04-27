
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { CreateOrderFormValues } from '@/lib/validators/order';

// Define a return type for the submission function
interface SubmitResult {
  success: boolean;
  error?: string;
  id?: string;
}

export function useOrderSubmit(userId: string | undefined, clearDraft: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateOrderFormValues, photoUrls: string[]): Promise<SubmitResult> => {
    if (!userId) {
      return { success: false, error: "Benutzer nicht angemeldet" };
    }
    
    setIsSubmitting(true);
    try {
      const pickupAddress = `${data.pickupStreet} ${data.pickupHouseNumber}, ${data.pickupPostalCode} ${data.pickupCity}, ${data.pickupCountry}${data.pickupAddressExtra ? ` (${data.pickupAddressExtra})` : ''}`;
      const deliveryAddress = `${data.deliveryStreet} ${data.deliveryHouseNumber}, ${data.deliveryPostalCode} ${data.deliveryCity}, ${data.deliveryCountry}${data.deliveryAddressExtra ? ` (${data.deliveryAddressExtra})` : ''}`;
      
      const { error: insertError, data: insertedOrder } = await supabase
        .from("orders")
        .insert([{ 
          description: data.description,
          from_address: pickupAddress,
          to_address: deliveryAddress,
          weight: data.weight,
          price: data.price,
          negotiable: data.negotiable,
          fragile: data.fragile,
          load_assistance: data.loadAssistance,
          tools_required: data.toolsRequired || '',
          security_measures: data.securityMeasures || '',
          item_name: data.itemName,
          category: data.category,
          preferred_vehicle_type: data.preferredVehicleType || '',
          deadline: data.deadline,
          status: 'pending',
          sender_id: userId,
          photo_urls: photoUrls
        }])
        .select('id')
        .single();
        
      if (insertError) throw insertError;

      clearDraft();
      toast.success("Transportauftrag erfolgreich erstellt!");
      return { success: true, id: insertedOrder.id };
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Fehler beim Erstellen des Transportauftrags.");
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unbekannter Fehler" 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
