
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Scan, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [scannedValue, setScannedValue] = useState("");
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScan = () => {
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
            <Button 
              onClick={() => setIsScanning(true)} 
              variant="outline" 
              className="w-full mt-3"
            >
              <Scan className="h-4 w-4 mr-2" />
              QR-Code scannen
            </Button>
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
                Bitte geben Sie den QR-Code-Wert ein oder verwenden Sie einen QR-Scanner
              </p>
              <Input
                value={scannedValue}
                onChange={(e) => setScannedValue(e.target.value)}
                placeholder="QR-Code-Wert eingeben"
                className="w-full"
              />
              <Button 
                onClick={handleScan} 
                className="w-full"
              >
                Bestätigen
              </Button>
              <Button 
                onClick={() => {
                  setIsScanning(false);
                  setScannedValue("");
                }} 
                variant="outline" 
                className="w-full"
              >
                Abbrechen
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCode;
