
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    const startScanning = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScan(decodedText);
            html5QrCode.stop();
          },
          (errorMessage) => {
            console.error("QR Scan error:", errorMessage);
          }
        );
        setIsStarting(false);
      } catch (err) {
        setError("Kamera konnte nicht gestartet werden. Bitte überprüfen Sie die Berechtigungen.");
        setIsStarting(false);
      }
    };

    startScanning();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScan]);

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute right-2 top-2 z-10"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="space-y-4">
        <div id="qr-reader" className="w-full max-w-sm mx-auto overflow-hidden rounded-lg" />
        
        {isStarting && (
          <p className="text-center text-sm text-muted-foreground">
            Kamera wird initialisiert...
          </p>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Halten Sie die Kamera auf den QR-Code
        </p>
      </div>
    </div>
  );
}
