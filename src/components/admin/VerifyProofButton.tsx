
import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { supabase } from "@/lib/supabaseClient";

interface VerifyProofButtonProps {
  deliveryLogId: string;
  disabled?: boolean;
  onVerified?: () => void;
}

export const VerifyProofButton: React.FC<VerifyProofButtonProps> = ({
  deliveryLogId,
  disabled = false,
  onVerified
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { session, profile } = useSimpleAuth();
  
  // Check if user is admin
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  
  const handleVerify = async () => {
    if (!session || !isAdmin) {
      toast({
        title: "Zugriff verweigert",
        description: "Nur für Administratoren verfügbar",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("verify-proof-match", {
        body: { delivery_log_id: deliveryLogId },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) throw error;
      
      // Handle different status responses
      if (data.status === "verified") {
        toast({
          title: "✅ Verifikation erfolgreich",
          description: `Zustellung verifiziert am ${new Date(data.timestamp).toLocaleString('de-DE')}`,
          variant: "default"
        });
        
        // Call callback if provided
        if (onVerified) onVerified();
      } 
      else if (data.status === "already_verified") {
        toast({
          title: "ℹ️ Bereits verifiziert",
          description: `Diese Zustellung wurde bereits am ${new Date(data.timestamp).toLocaleString('de-DE')} verifiziert.`,
          variant: "default"
        });
      } 
      else if (data.status === "verification_failed") {
        toast({
          title: "⚠️ Verifikation fehlgeschlagen",
          description: data.message || "QR-Code konnte nicht verifiziert werden",
          variant: "destructive"
        });
      }
      else {
        // Unexpected response
        toast({
          title: "⚠️ Unerwartete Antwort",
          description: "Die Verifikation hat ein unerwartetes Ergebnis zurückgegeben.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Fehler bei der Verifikation:", err);
      const errorMessage = err instanceof Error ? err.message : "Ein unbekannter Fehler ist aufgetreten";
      
      toast({
        title: "❌ Verifikation fehlgeschlagen",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // If not admin, return null or a disabled message
  if (!isAdmin) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Diese Funktion ist nur für Administratoren verfügbar
      </div>
    );
  }
  
  return (
    <Button
      onClick={handleVerify}
      disabled={disabled || isLoading}
      variant="accent"
      className="gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Verifiziere...
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4" />
          Zustellung prüfen
        </>
      )}
    </Button>
  );
};

export default VerifyProofButton;
