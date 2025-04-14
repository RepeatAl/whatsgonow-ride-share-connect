
import { useState } from "react";
import { FileCheck, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { invoiceService } from "@/services/invoice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

interface VerifyInvoiceButtonProps {
  invoiceId: string;
  disabled?: boolean;
}

const VerifyInvoiceButton = ({
  invoiceId,
  disabled = false,
}: VerifyInvoiceButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const handleVerifyInvoice = async () => {
    setIsLoading(true);
    setVerificationResult(null);
    
    try {
      // Fetch invoice data from database
      const { data: invoice, error } = await invoiceService.getInvoiceById(invoiceId);
      
      if (error || !invoice) {
        throw new Error("Rechnung nicht gefunden oder kein Zugriff");
      }
      
      if (!invoice.digital_signature) {
        toast({
          title: "Keine Signatur",
          description: "Diese Rechnung wurde nicht digital signiert.",
          variant: "destructive",
        });
        setVerificationResult(false);
        setIsOpen(true);
        return;
      }
      
      setInvoiceData(invoice);
      
      // Generate a sample invoice content - in a real app, this would be fetched from the DB
      // Here we're using a placeholder value
      const invoiceContent = `Rechnung für Auftrag #${invoice.order_id} - ${new Date(invoice.created_at).toLocaleDateString('de-DE')}`;
      
      // Verify the signature
      const isValid = await invoiceService.verifyInvoiceSignature({
        invoiceText: invoiceContent,
        signatureBase64: invoice.digital_signature.signature,
        publicKeyPEM: invoice.digital_signature.publicKey
      });
      
      setVerificationResult(isValid);
      setIsOpen(true);
      
      toast({
        title: isValid ? "Verifizierung erfolgreich" : "Verifizierung fehlgeschlagen",
        description: isValid 
          ? "Die digitale Signatur ist gültig." 
          : "Die digitale Signatur konnte nicht verifiziert werden.",
        variant: isValid ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error verifying invoice signature:", error);
      toast({
        title: "Fehler",
        description: "Bei der Signaturprüfung ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
      setVerificationResult(false);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || isLoading}
        onClick={handleVerifyInvoice}
        className="text-amber-600"
      >
        <FileCheck className="h-4 w-4 mr-1" />
        Signatur prüfen
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signaturprüfung</DialogTitle>
          </DialogHeader>
          
          {verificationResult === null && (
            <div className="py-6 flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p>Signatur wird geprüft...</p>
            </div>
          )}
          
          {verificationResult === true && (
            <div className="py-6 flex flex-col items-center text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Signatur gültig</h3>
              <p className="text-sm text-gray-600 mb-2">
                Die digitale Signatur dieser Rechnung wurde erfolgreich verifiziert.
              </p>
              {invoiceData?.digital_signature && (
                <div className="mt-4 text-xs text-left bg-gray-50 p-3 rounded w-full">
                  <p><strong>Algorithmus:</strong> {invoiceData.digital_signature.algorithm}</p>
                  <p><strong>Hash:</strong> {invoiceData.digital_signature.hashAlgorithm}</p>
                  <p><strong>Erstellt:</strong> {new Date(invoiceData.digital_signature.created).toLocaleString('de-DE')}</p>
                </div>
              )}
            </div>
          )}
          
          {verificationResult === false && (
            <div className="py-6 flex flex-col items-center text-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Signatur ungültig</h3>
              <p className="text-sm text-gray-600">
                Die digitale Signatur konnte nicht verifiziert werden. Die Rechnung wurde 
                möglicherweise manipuliert oder die Signatur ist beschädigt.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Schließen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VerifyInvoiceButton;
