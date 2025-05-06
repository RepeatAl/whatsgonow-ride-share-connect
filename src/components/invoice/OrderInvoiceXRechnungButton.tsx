
import { useState } from "react";
import { FileBarChart2, FileArchive, FileCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { invoiceService } from "@/services/invoice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface OrderInvoiceXRechnungButtonProps {
  orderId: string;
  email?: string;
  recipientName?: string;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/**
 * Button zum Senden einer XRechnung für einen Auftrag
 */
const OrderInvoiceXRechnungButton = ({
  orderId,
  email: initialEmail = '',
  recipientName: initialName = '',
  disabled = false,
  size = 'sm',
  variant = 'outline'
}: OrderInvoiceXRechnungButtonProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [recipientName, setRecipientName] = useState(initialName);
  
  // Prüfen, ob die E-Mail-Adresse zu einer Behörde gehört
  const isGovernmentEmail = email ? invoiceService.isGovernmentAgency(email) : false;
  
  const handleOpen = (preview: boolean = false) => {
    setIsPreview(preview);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // XRechnung senden (Vorschau oder echte Rechnung)
      let success;
      
      if (isPreview) {
        success = await invoiceService.sendXRechnungPreview(
          orderId, 
          email, 
          recipientName
        );
      } else {
        success = await invoiceService.sendXRechnungEmail(
          orderId, 
          email, 
          recipientName
        );
      }
      
      if (success) {
        handleClose();
        toast({
          title: isPreview ? "Vorschau gesendet" : "XRechnung gesendet",
          description: isPreview 
            ? "Die XRechnung-Vorschau wurde erfolgreich versendet."
            : "Die XRechnung wurde erfolgreich versendet."
        });
      }
    } catch (error) {
      console.error("Fehler beim Senden der XRechnung:", error);
      toast({
        title: "Fehler",
        description: "Die XRechnung konnte nicht versendet werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={() => handleOpen(false)}
        className="gap-1"
      >
        <FileBarChart2 className="h-4 w-4" />
        <span className="hidden md:inline">XRechnung</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isPreview ? "XRechnung-Vorschau" : "XRechnung senden"}
            </DialogTitle>
            <DialogDescription>
              {isPreview 
                ? "Senden Sie eine Vorschau der XRechnung zum Testen."
                : "Senden Sie eine elektronische Rechnung im XRechnung-Format an eine Behörde."
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@behoerde.de"
                className={isGovernmentEmail ? "border-green-500" : ""}
              />
              {email && (
                <div className="text-xs">
                  {isGovernmentEmail ? (
                    <p className="text-green-600">
                      ✓ Diese E-Mail gehört zu einer Behörde
                    </p>
                  ) : (
                    <p className="text-amber-600">
                      Diese E-Mail scheint nicht zu einer Behörde zu gehören. XRechnungen sind nur für Behörden erforderlich.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientName">Empfängername</Label>
              <Input
                id="recipientName"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Behörde / Amt"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpen(true)}
                disabled={isLoading}
                className="gap-1"
              >
                <FileCog className="h-4 w-4" />
                Vorschau
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-1">
                {isLoading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full mr-2" />
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <FileArchive className="h-4 w-4" />
                    {isPreview ? "Vorschau senden" : "XRechnung senden"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderInvoiceXRechnungButton;
