
import { useState } from "react";
import { FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { invoiceService } from "@/services/invoice";

interface OrderInvoiceSignButtonProps {
  orderId: string;
  invoiceId: string;
  disabled?: boolean;
}

const OrderInvoiceSignButton = ({
  orderId,
  invoiceId,
  disabled = false,
}: OrderInvoiceSignButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignInvoice = async () => {
    setIsLoading(true);
    try {
      // Generate a sample invoice content from the order ID
      const invoiceContent = `Rechnung für Auftrag #${orderId} - ${new Date().toLocaleDateString('de-DE')}`;
      
      // Use the signInvoiceText function which accepts text content
      const success = await invoiceService.signInvoiceText(invoiceContent, invoiceId);
      
      if (success) {
        toast({
          title: "Erfolg",
          description: "Die Rechnung wurde digital signiert.",
        });
      }
    } catch (error) {
      console.error("Error signing invoice:", error);
      toast({
        title: "Fehler",
        description: "Die Rechnung konnte nicht signiert werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled || isLoading}
      onClick={handleSignInvoice}
      className="text-emerald-600"
    >
      <FileSignature className="h-4 w-4 mr-1" />
      Digital signieren
    </Button>
  );
};

export default OrderInvoiceSignButton;
