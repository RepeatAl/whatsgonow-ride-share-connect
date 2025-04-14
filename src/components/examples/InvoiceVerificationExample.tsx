
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrderInvoiceButton from "@/components/order/OrderInvoiceButton";
import OrderInvoiceSignButton from "@/components/order/OrderInvoiceSignButton";
import VerifyInvoiceButton from "@/components/order/VerifyInvoiceButton";

const InvoiceVerificationExample = () => {
  // In a real app, this would come from the database
  const exampleOrderId = "123e4567-e89b-12d3-a456-426614174000";
  const exampleInvoiceId = "123e4567-e89b-12d3-a456-426614174001";
  const userEmail = "test@example.com";

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Digitale Signatur Beispiel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Schritt 1: Rechnung erstellen</h3>
          <OrderInvoiceButton 
            orderId={exampleOrderId} 
            isCompleted={true} 
            userEmail={userEmail} 
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Schritt 2: Rechnung digital signieren</h3>
          <OrderInvoiceSignButton 
            orderId={exampleOrderId} 
            invoiceId={exampleInvoiceId} 
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Schritt 3: Signatur verifizieren</h3>
          <VerifyInvoiceButton 
            invoiceId={exampleInvoiceId} 
          />
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        <p>
          Digitale Signaturen bieten ein hohes Maß an Sicherheit und Vertrauen für elektronische Dokumente
          und erfüllen gesetzliche Anforderungen nach GoBD und XRechnung.
        </p>
      </CardFooter>
    </Card>
  );
};

export default InvoiceVerificationExample;
