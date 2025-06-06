
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";

export function useUploadVisibility() {
  const { profile } = useOptimizedAuth();
  
  const canUploadItems = profile?.role === "sender_business" || 
                        profile?.role === "sender_private";
  
  return {
    canUploadItems
  };
}
