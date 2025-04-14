
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCode from "@/components/payment/QRCode";

interface QRCodeSectionProps {
  qrCodeValue: string;
  isProcessingPayment: boolean;
  setShowQRCode: (show: boolean) => void;
  handleQRScan: (value: string) => void;
}

export const QRCodeSection = ({
  qrCodeValue,
  isProcessingPayment,
  setShowQRCode,
  handleQRScan,
}: QRCodeSectionProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-3">Lieferung bestätigen</h2>
        <p className="text-gray-600 text-center mb-4">
          Bitten Sie den Empfänger, diesen QR-Code zu scannen, um die Lieferung zu bestätigen
        </p>
        
        <div className="w-full max-w-xs">
          <QRCode 
            value={qrCodeValue}
            size={200}
            className="mx-auto"
            onScan={handleQRScan}
            allowScan={true}
          />
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={() => setShowQRCode(false)}
            variant="outline"
          >
            Schließen
          </Button>
          <Button 
            onClick={() => handleQRScan(qrCodeValue)}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verarbeitung...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Manuell bestätigen
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
