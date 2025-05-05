
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CreateOrderFormValues } from "@/lib/validators/order";
import { useOrderSubmit } from '@/hooks/useOrderSubmit';
import { useAuth } from '@/contexts/AuthContext';
import { useAddressBook } from '@/hooks/useAddressBook';

export function useCreateOrderSubmit(clearDraft: () => void) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { autoSaveAddressFromOrder } = useAddressBook();
  const [showFindDriverDialog, setShowFindDriverDialog] = useState(false);
  
  const { handleSubmit: submitOrder, isSubmitting } = useOrderSubmit(user?.id, clearDraft);

  const handleCreateOrder = async (data: CreateOrderFormValues, uploadedPhotoUrls: string[]) => {
    try {
      // First upload any remaining photos
      const result = await submitOrder(data, uploadedPhotoUrls);
      
      // Ensure we have a valid result before navigating
      if (result && result.success) {
        // Automatische Adressspeicherung
        await autoSaveAddressFromOrder(data);
        
        // Clear any local storage or form data to prevent state persistence issues
        clearDraft();
        localStorage.removeItem('order-draft');
        
        // Show dialog asking if user wants to find a driver
        setShowFindDriverDialog(true);
      } else {
        // Handle submission error
        toast.error("Fehler beim Erstellen des Auftrags: " + (result?.error || "Unbekannter Fehler"));
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Fehler beim Erstellen des Auftrags");
    }
  };

  const handleFindDriverDialogClose = (findDriver: boolean) => {
    setShowFindDriverDialog(false);
    
    if (findDriver) {
      // Weiterleitung zur Fahrer-Suche
      navigate("/find-driver", { 
        state: { 
          fromNewOrder: true,
          useAddressBook: true 
        } 
      });
    } else {
      // Weiterleitung zum Profil
      navigate("/profile", { replace: true });
    }
  };

  return {
    handleCreateOrder,
    isSubmitting,
    userId: user?.id,
    showFindDriverDialog,
    handleFindDriverDialogClose
  };
}
