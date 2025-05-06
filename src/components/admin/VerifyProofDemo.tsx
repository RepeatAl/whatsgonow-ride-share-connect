
import React, { useState } from 'react';
import { VerifyProofButton } from './VerifyProofButton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface VerifyProofDemoProps {
  deliveryLogId: string;
  orderDetails?: {
    orderId: string;
    sender: string;
    recipient: string;
    dateCreated: string;
  };
}

export const VerifyProofDemo: React.FC<VerifyProofDemoProps> = ({
  deliveryLogId,
  orderDetails
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleVerified = () => {
    // Trigger a refresh when verification is successful
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Zustellungsnachweis Verifikation</CardTitle>
        <CardDescription>
          Admin-Tool zur Überprüfung von QR-Code Zustellnachweisen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orderDetails && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Auftrag ID:</div>
              <div className="font-medium">{orderDetails.orderId}</div>
              
              <div className="text-muted-foreground">Absender:</div>
              <div className="font-medium">{orderDetails.sender}</div>
              
              <div className="text-muted-foreground">Empfänger:</div>
              <div className="font-medium">{orderDetails.recipient}</div>
              
              <div className="text-muted-foreground">Erstelldatum:</div>
              <div className="font-medium">{orderDetails.dateCreated}</div>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <VerifyProofButton 
              deliveryLogId={deliveryLogId} 
              onVerified={handleVerified}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifyProofDemo;
