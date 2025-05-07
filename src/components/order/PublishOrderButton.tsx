
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

  const handlePublish = async () => {
    if (isPublished || isPublishing) return;

    setIsPublishing(true);
    try {
      const result = await publishOrder(orderId);
      
      if (result.success) {
        toast.success("Auftrag veröffentlicht – Fahrer werden informiert");
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || "Fehler beim Veröffentlichen");
      }
    } catch (error) {
      console.error("Fehler beim Veröffentlichen:", error);
      toast.error("Unerwarteter Fehler beim Veröffentlichen");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Button
      onClick={handlePublish}
      disabled={isPublished || isPublishing}
      variant={isPublished ? "outline" : "brand"}
      className="flex items-center gap-2"
    >
      {isPublishing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Wird veröffentlicht...</span>
        </>
      ) : isPublished ? (
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
