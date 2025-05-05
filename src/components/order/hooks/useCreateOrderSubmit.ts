
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CreateOrderFormValues } from "@/lib/validators/order";
import { useOrderSubmit } from '@/hooks/useOrderSubmit';
import { useAuth } from '@/contexts/AuthContext';

export function useCreateOrderSubmit(clearDraft: () => void) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { handleSubmit: submitOrder, isSubmitting } = useOrderSubmit(user?.id, clearDraft);

  const handleCreateOrder = async (data: CreateOrderFormValues, uploadedPhotoUrls: string[]) => {
    try {
      // First upload any remaining photos
      const result = await submitOrder(data, uploadedPhotoUrls);
      
      // Ensure we have a valid result before navigating
      if (result && result.success) {
        // Clear any local storage or form data to prevent state persistence issues
        clearDraft();
        localStorage.removeItem('order-draft');
        
        // Navigate to the orders page with a small delay to ensure cleanup is complete
        setTimeout(() => {
          navigate("/orders", { replace: true });
        }, 100);
      } else {
        // Handle submission error
        toast.error("Fehler beim Erstellen des Auftrags: " + (result?.error || "Unbekannter Fehler"));
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Fehler beim Erstellen des Auftrags");
    }
  };

  return {
    handleCreateOrder,
    isSubmitting,
    userId: user?.id
  };
}
