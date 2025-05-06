
import { useState } from "react";
import { FileBadge, Send, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { invoiceService } from "@/services/invoice";

interface OrderInvoiceXRechnungButtonProps {
  orderId: string;
  disabled?: boolean;
  isCompleted?: boolean;
  recipientEmail?: string;
  recipientName?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
}

/**
 * Button zum Versenden von XRechnungen (speziell für Behörden)
 */
const OrderInvoiceXRechnungButton = ({
  orderId,
  disabled = false,
  isCompleted = true,
  recipientEmail,
  recipientName = "Sehr geehrte Damen und Herren",
  variant = "outline",
  size = "sm",
  showIcon = true,
}: OrderInvoiceXRechnungButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Prüft, ob E-Mail-Adresse zu einer Behörde gehört
  const isGovernmentAgency = recipientEmail 
    ? invoiceService.isGovernmentAgency(recipientEmail) 
    : false;

  // XRechnung versenden
  const handleSendXRechnung = async () => {
    if (!isCompleted) {
      toast({
        title: "Nicht verfügbar",
        description: "XRechnungen sind erst nach Abschluss des Auftrags verfügbar.",
        variant: "destructive"
      });
      return;
    }

    if (!recipientEmail) {
      toast({
        title: "E-Mail-Adresse fehlt",
        description: "Keine E-Mail-Adresse zum Senden verfügbar.",
        variant: "destructive"
      });
      return;
    }

    if (!isGovernmentAgency) {
      toast({
        title: "Kein behördlicher Empfänger",
        description: "XRechnungen können nur an Behörden gesendet werden.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await invoiceService.sendXRechnungEmail(
        orderId, 
        recipientEmail,
        recipientName // Passing the recipientName parameter
      );
    } catch (error) {
      console.error("Fehler beim Versenden der XRechnung:", error);
      toast({
        title: "Fehler",
        description: "Die XRechnung konnte nicht versendet werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // XRechnung Vorschau senden
  const handleSendPreview = async () => {
    if (!isCompleted) {
      toast({
        title: "Nicht verfügbar",
        description: "XRechnung-Vorschauen sind erst nach Abschluss des Auftrags verfügbar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Fix: Add all three required parameters
      await invoiceService.sendXRechnungPreview(
        orderId,
        recipientEmail || 'test@xrechnung.de', // Default testing address if none provided
        recipientName
      );
    } catch (error) {
      console.error("Fehler beim Versenden der XRechnung-Vorschau:", error);
      toast({
        title: "Fehler",
        description: "Die XRechnung-Vorschau konnte nicht versendet werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Falls der Auftrag noch nicht abgeschlossen ist, deaktiviere den Button
  if (!isCompleted) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled={true}
        className="text-gray-400"
        title="XRechnung erst nach Auftragsabschluss verfügbar"
      >
        {showIcon && <FileBadge className="h-4 w-4 mr-1" />}
        XRechnung
      </Button>
    );
  }

  // Vollständiger Button mit zwei Aktionen
  return (
    <div className="flex space-x-1">
      <Button
        variant={variant}
        size={size}
        disabled={disabled || isLoading || !isGovernmentAgency}
        onClick={handleSendXRechnung}
        className={isGovernmentAgency ? "text-primary" : "text-gray-400"}
        title={isGovernmentAgency 
          ? "XRechnung an Behörde senden" 
          : "XRechnungen können nur an Behörden gesendet werden"}
      >
        {showIcon && <Send className="h-4 w-4 mr-1" />}
        XRechnung
      </Button>
      
      <Button
        variant="ghost"
        size={size}
        disabled={disabled || isLoading}
        onClick={handleSendPreview}
        className="text-gray-600"
        title="XRechnung-Vorschau an Testadresse senden"
      >
        <PlayCircle className="h-4 w-4" />
        <span className="sr-only">XRechnung-Vorschau</span>
      </Button>
    </div>
  );
};

export default OrderInvoiceXRechnungButton;
