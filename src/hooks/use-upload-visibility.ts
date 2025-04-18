
import { useAuth } from "@/contexts/AuthContext";

export function useUploadVisibility() {
  const { profile } = useAuth();
  
  const canUploadItems = profile?.role === "sender_business" || 
                        profile?.role === "sender_private";
  
  return {
    canUploadItems
  };
}
