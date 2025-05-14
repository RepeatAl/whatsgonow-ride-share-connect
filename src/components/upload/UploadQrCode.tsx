
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";

interface UploadQrCodeProps {
  userId?: string;
  target: string;
  onComplete?: (urls: string[]) => void;
  children?: React.ReactNode;
  compact?: boolean;
}

export const UploadQrCode: React.FC<UploadQrCodeProps> = ({
  userId,
  target,
  onComplete,
  children,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadId, setUploadId] = useState("");
  const [uploadUrls, setUploadUrls] = useState<string[]>([]);

  // Generate a new upload ID when the component mounts or when isOpen changes
  useEffect(() => {
    if (isOpen) {
      setUploadId(uuidv4());
    }
  }, [isOpen]);

  // Listen for upload completion events
  useEffect(() => {
    if (!isOpen || !uploadId) return;
    
    const channel = supabase
      .channel(`upload-${uploadId}`)
      .on('broadcast', { event: 'upload-complete' }, (payload) => {
        if (payload.payload && payload.payload.urls && Array.isArray(payload.payload.urls)) {
          setUploadUrls(payload.payload.urls);
          
          if (onComplete) {
            onComplete(payload.payload.urls);
          }
          
          // Close the dialog after a short delay
          setTimeout(() => {
            setIsOpen(false);
          }, 2000);
        }
      })
      .subscribe();
    
    return () => {
      channel.unsubscribe();
    };
  }, [isOpen, uploadId, onComplete]);

  const qrCodeUrl = `${window.location.origin}/mobile-upload?target=${target}&id=${uploadId}${userId ? `&userId=${userId}` : ''}`;

  // Handler zum Öffnen des Dialogs, mit stopPropagation
  const handleOpenDialog = (e: React.MouseEvent) => {
    // Verhindert, dass das Click-Event an Parent-Handler weitergegeben wird
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      {compact ? (
        <span onClick={handleOpenDialog}>
          {children || (
            <Button 
              type="button" 
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M8.5 8.5h.01" />
                <path d="M15.5 15.5h.01" />
                <path d="M8.5 15.5h.01" />
                <path d="M15.5 8.5h.01" />
              </svg>
            </Button>
          )}
        </span>
      ) : (
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleOpenDialog}
        >
          {children || "Mit Smartphone aufnehmen"}
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fotos mit dem Smartphone aufnehmen</DialogTitle>
            <DialogDescription>
              Scannen Sie diesen QR-Code mit Ihrem Smartphone, um Fotos direkt hochzuladen.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center p-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG value={qrCodeUrl} size={200} />
            </div>
          </div>
          
          {uploadUrls.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-green-700 font-medium">
                {uploadUrls.length} Fotos erfolgreich hochgeladen!
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
