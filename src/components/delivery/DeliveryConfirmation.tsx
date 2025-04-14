
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import QRCode from "@/components/payment/QRCode";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface DeliveryConfirmationProps {
  orderId: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmed: () => void;
}

export const DeliveryConfirmation = ({
  orderId,
  userId,
  isOpen,
  onClose,
  onConfirmed
}: DeliveryConfirmationProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [qrCodeToken, setQrCodeToken] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle");

  // Generate a QR code token and store it in the database
  const generateQRToken = async () => {
    setIsGenerating(true);
    try {
      // First check if order already has a token
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("qr_code_token, status")
        .eq("order_id", orderId)
        .single();

      if (orderError) throw orderError;
      
      // Check if order is already completed
      if (orderData.status === "abgeschlossen") {
        toast({
          title: "Lieferung bereits bestätigt",
          description: "Diese Lieferung wurde bereits bestätigt und kann nicht erneut gescannt werden.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      // Use existing token or generate a new one
      let token = orderData.qr_code_token;
      
      if (!token) {
        token = `delivery-${orderId}-${uuidv4()}`;
        
        // Set token expiration time (24 hours from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        
        const { error: updateError } = await supabase
          .from("orders")
          .update({ 
            qr_code_token: token,
            token_expires_at: expiresAt.toISOString()
          })
          .eq("order_id", orderId);
        
        if (updateError) throw updateError;

        // Log token generation
        await supabase
          .from("delivery_logs")
          .insert({
            order_id: orderId,
            user_id: userId,
            action: "token_generated"
          });
      }
      
      setQrCodeToken(token);
    } catch (error) {
      console.error("Error generating QR token:", error);
      toast({
        title: "Fehler",
        description: "QR-Code konnte nicht erstellt werden. Bitte versuche es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Verify the QR code token
  const verifyToken = async (scannedToken: string) => {
    if (!qrCodeToken) return;
    
    setIsVerifying(true);
    try {
      // First check if the tokens match
      if (scannedToken !== qrCodeToken) {
        setVerificationStatus("error");
        toast({
          title: "Ungültiger QR-Code",
          description: "Der gescannte QR-Code ist ungültig oder wurde manipuliert.",
          variant: "destructive"
        });
        return;
      }

      // Check if the order exists and is not already completed
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("status, token_expires_at")
        .eq("order_id", orderId)
        .eq("qr_code_token", scannedToken)
        .single();

      if (orderError) {
        setVerificationStatus("error");
        toast({
          title: "Fehler",
          description: "Auftrag nicht gefunden oder QR-Code ungültig.",
          variant: "destructive"
        });
        return;
      }

      // Check if order is already completed
      if (orderData.status === "abgeschlossen") {
        setVerificationStatus("error");
        toast({
          title: "Bereits bestätigt",
          description: "Diese Lieferung wurde bereits bestätigt.",
          variant: "destructive"
        });
        return;
      }

      // Check if token has expired
      if (orderData.token_expires_at && new Date(orderData.token_expires_at) < new Date()) {
        setVerificationStatus("error");
        toast({
          title: "QR-Code abgelaufen",
          description: "Der QR-Code ist abgelaufen. Bitte generiere einen neuen Code.",
          variant: "destructive"
        });
        return;
      }

      // Update order status and mark as verified
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: "abgeschlossen", 
          verified_at: now,
          qr_code_token: null // Invalidate the token
        })
        .eq("order_id", orderId);
      
      if (updateError) throw updateError;

      // Log successful verification
      await supabase
        .from("delivery_logs")
        .insert({
          order_id: orderId,
          user_id: userId,
          action: "delivery_confirmed"
        });

      setVerificationStatus("success");
      toast({
        title: "Lieferung bestätigt",
        description: "Die Lieferung wurde erfolgreich bestätigt.",
      });
      
      // Notify parent component
      setTimeout(() => {
        onConfirmed();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error verifying token:", error);
      setVerificationStatus("error");
      toast({
        title: "Fehler",
        description: "Bei der Bestätigung ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Reset state when dialog closes
  const handleClose = () => {
    if (!isVerifying) {
      setQrCodeToken(null);
      setVerificationStatus("idle");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lieferung bestätigen</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          {!qrCodeToken ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Generiere einen QR-Code, den der Empfänger scannen kann, um die Lieferung zu bestätigen.
              </p>
              <Button 
                onClick={generateQRToken} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generiere QR-Code...
                  </>
                ) : (
                  "QR-Code generieren"
                )}
              </Button>
            </div>
          ) : verificationStatus === "success" ? (
            <div className="flex flex-col items-center space-y-3 py-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium text-center">Lieferung erfolgreich bestätigt!</h3>
              <p className="text-sm text-gray-500 text-center">
                Die Zustellung wurde verifiziert und der Zahlungsprozess eingeleitet.
              </p>
            </div>
          ) : verificationStatus === "error" ? (
            <div className="flex flex-col items-center space-y-3 py-4">
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-medium text-center">Bestätigung fehlgeschlagen</h3>
              <p className="text-sm text-gray-500 text-center">
                Der QR-Code konnte nicht verifiziert werden. Bitte versuche es erneut.
              </p>
              <Button 
                onClick={() => {
                  setVerificationStatus("idle");
                  setQrCodeToken(null);
                }}
                variant="outline"
              >
                Zurück
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 text-center mb-4">
                Bitte lasse den Empfänger diesen QR-Code scannen, um die Lieferung zu bestätigen
              </p>
              <QRCode 
                value={qrCodeToken}
                size={240}
                onScan={verifyToken}
                allowScan={true}
              />
              <p className="text-xs text-gray-400 mt-2">
                QR-Code ist 24 Stunden gültig
              </p>
            </>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          {qrCodeToken && verificationStatus === "idle" && (
            <div className="flex gap-2 w-full justify-between">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isVerifying}
              >
                Schließen
              </Button>
              <Button 
                onClick={() => verifyToken(qrCodeToken)}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifiziere...
                  </>
                ) : (
                  "Manuell bestätigen"
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
