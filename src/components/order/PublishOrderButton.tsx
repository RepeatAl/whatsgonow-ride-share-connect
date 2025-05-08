
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { publishOrder } from "@/services/orders/publishOrder";

interface PublishOrderButtonProps {
  orderId: string;
  isPublished: boolean;
  onSuccess?: () => void;
}

export function PublishOrderButton({ 
  orderId, 
  isPublished, 
  onSuccess 
}: PublishOrderButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  // Lokaler State für optimistisches UI-Update
  const [localIsPublished, setLocalIsPublished] = useState(isPublished);

  const handlePublish = async () => {
    // Nichts tun wenn bereits veröffentlicht oder gerade im Veröffentlichungsprozess
    if (localIsPublished || isPublishing) return;

    // Optimistisches UI-Update
    setLocalIsPublished(true);
    setIsPublishing(true);
    
    try {
      const result = await publishOrder(orderId);
      
      if (result.success) {
        toast.success("Auftrag veröffentlicht – Fahrer werden informiert");
        if (onSuccess) onSuccess();
      } else {
        // Bei Fehler den lokalen Status zurücksetzen
        setLocalIsPublished(false);
        toast.error(result.error || "Fehler beim Veröffentlichen");
      }
    } catch (error) {
      // Bei Exception den lokalen Status zurücksetzen
      setLocalIsPublished(false);
      console.error("Fehler beim Veröffentlichen:", error);
      toast.error("Unerwarteter Fehler beim Veröffentlichen");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Button
      onClick={handlePublish}
      disabled={localIsPublished || isPublishing}
      variant={localIsPublished ? "outline" : "brand"}
      className="flex items-center gap-2"
    >
      {isPublishing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Wird veröffentlicht...</span>
        </>
      ) : localIsPublished ? (
        <span>Bereits veröffentlicht</span>
      ) : (
        <>
          <Send className="h-4 w-4" />
          <span>Jetzt veröffentlichen</span>
        </>
      )}
    </Button>
  );
}
