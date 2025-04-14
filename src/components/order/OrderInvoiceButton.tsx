
import { useState } from "react";
import { FileText, Download, Mail, BookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { invoiceService } from "@/services/invoice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderInvoiceButtonProps {
  orderId: string;
  disabled?: boolean;
  isCompleted?: boolean;
  userEmail?: string;
}

const OrderInvoiceButton = ({
  orderId,
  disabled = false,
  isCompleted = true,
  userEmail,
}: OrderInvoiceButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!isCompleted) {
      toast({
        title: "Nicht verfügbar",
        description: "Rechnungen sind erst nach Abschluss des Auftrags verfügbar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await invoiceService.downloadPDFInvoice(orderId, `Rechnung-${orderId}.pdf`);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast({
        title: "Fehler",
        description: "Die Rechnung konnte nicht heruntergeladen werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadXML = async () => {
    if (!isCompleted) {
      toast({
        title: "Nicht verfügbar",
        description: "E-Rechnungen sind erst nach Abschluss des Auftrags verfügbar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await invoiceService.downloadXMLInvoice(orderId, `XRechnung-${orderId}.xml`);
    } catch (error) {
      console.error("Error downloading XML invoice:", error);
      toast({
        title: "Fehler",
        description: "Die E-Rechnung konnte nicht heruntergeladen werden.",
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
        description: "Rechnungen sind erst nach Abschluss des Auftrags verfügbar.",
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
      await invoiceService.sendInvoiceEmail(orderId, userEmail);
    } catch (error) {
      console.error("Error sending invoice email:", error);
      toast({
        title: "Fehler",
        description: "Die Rechnung konnte nicht per E-Mail versendet werden.",
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
        <FileText className="h-4 w-4 mr-1" />
        Rechnung
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
          <FileText className="h-4 w-4 mr-1" />
          Rechnung
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          PDF herunterladen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadXML}>
          <BookText className="h-4 w-4 mr-2" />
          XRechnung herunterladen
        </DropdownMenuItem>
        {userEmail && (
          <DropdownMenuItem onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Per E-Mail senden
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderInvoiceButton;
