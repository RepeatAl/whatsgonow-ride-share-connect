
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

export function useUploadVisibility() {
  const { profile } = useSimpleAuth();
  
  const canUploadItems = profile?.role === "sender_business" || 
                        profile?.role === "sender_private";
  
  return {
    canUploadItems
  };
}
