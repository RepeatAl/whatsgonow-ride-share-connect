
import { useState } from "react";
import { FileDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { receiptService } from "@/services/receiptService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderReceiptButtonProps {
  orderId: string;
  disabled?: boolean;
  isCompleted?: boolean;
  userEmail?: string;
}

const OrderReceiptButton = ({
  orderId,
  disabled = false,
  isCompleted = true,
  userEmail,
}: OrderReceiptButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!isCompleted) {
      toast({
        title: "Nicht verfügbar",
        description: "Quittungen sind erst nach Abschluss des Auftrags verfügbar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await receiptService.downloadReceipt(orderId, `Quittung-${orderId}.pdf`);
      toast({
        title: "Erfolg",
        description: "Die Quittung wurde heruntergeladen."
      });
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast({
        title: "Fehler",
        description: "Die Quittung konnte nicht heruntergeladen werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!isCompleted) {
      toast({
        title: "Nicht verfügbar",
        description: "Quittungen sind erst nach Abschluss des Auftrags verfügbar.",
        variant: "destructive"
      });
      return;
    }

    if (!userEmail) {
      toast({
        title: "E-Mail-Adresse fehlt",
        description: "Keine E-Mail-Adresse zum Senden verfügbar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await receiptService.sendReceiptEmail(orderId, userEmail);
    } catch (error) {
      console.error("Error sending receipt email:", error);
      toast({
        title: "Fehler",
        description: "Die Quittung konnte nicht per E-Mail versendet werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isCompleted) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={true}
        className="text-gray-400"
      >
        <FileDown className="h-4 w-4 mr-1" />
        Quittung
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isLoading}
          className="text-primary"
        >
          <FileDown className="h-4 w-4 mr-1" />
          Quittung
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDownload}>
          <FileDown className="h-4 w-4 mr-2" />
          Herunterladen
        </DropdownMenuItem>
        {userEmail && (
          <DropdownMenuItem onClick={handleSendEmail}>
            <Send className="h-4 w-4 mr-2" />
            Per E-Mail senden
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderReceiptButton;
