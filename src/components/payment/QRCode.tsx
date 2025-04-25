
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Scan, Check, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRScanner } from "@/components/qr/QRScanner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  onScan?: (value: string) => void;
  allowScan?: boolean;
}

const QRCode = ({ 
  value, 
  size = 180, 
  className = "", 
  onScan,
  allowScan = false
}: QRCodeProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedValue, setScannedValue] = useState("");
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScan = (value: string) => {
    setScannedValue(value);
    handleVerify();
  };

  const handleManualInput = () => {
    handleVerify();
  };

  const handleVerify = () => {
    if (scannedValue === value) {
      setScanSuccess(true);
      if (onScan) {
        onScan(value);
      }
      // Reset after success
      setTimeout(() => {
        setIsScanning(false);
        setScannedValue("");
        setScanSuccess(false);
        setShowScanner(false);
      }, 3000);
    } else {
      // Invalid scan value
      setScannedValue("");
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm ${className}`}>
      {!isScanning ? (
        <>
          <QRCodeSVG
            value={value}
            size={size}
            level="M"
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
          
          {allowScan && (
            <div className="flex flex-col gap-2 mt-3">
              <Button 
                onClick={() => {
                  setIsScanning(true);
                  setShowScanner(true);
                }} 
                variant="outline"
              >
                <Camera className="h-4 w-4 mr-2" />
                Mit Kamera scannen
              </Button>
              <Button 
                onClick={() => setIsScanning(true)} 
                variant="outline"
              >
                <Scan className="h-4 w-4 mr-2" />
                Code manuell eingeben
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <h3 className="text-center font-medium">QR-Code Bestätigung</h3>
          
          {scanSuccess ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-green-100 p-3 rounded-full mb-2">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-green-700 font-medium">QR-Code erfolgreich gescannt!</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 text-center">
                Bitte scannen Sie den QR-Code oder geben Sie den Code manuell ein
              </p>
              <Input
                value={scannedValue}
                onChange={(e) => setScannedValue(e.target.value)}
                placeholder="QR-Code-Wert eingeben"
                className="w-full"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setIsScanning(false);
                    setScannedValue("");
                    setShowScanner(false);
                  }} 
                  variant="outline" 
                  className="w-full"
                >
                  Abbrechen
                </Button>
                <Button 
                  onClick={handleManualInput} 
                  className="w-full"
                >
                  Bestätigen
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="sm:max-w-md">
          <QRScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRCode;
