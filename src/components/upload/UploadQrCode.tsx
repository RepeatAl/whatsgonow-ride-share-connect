
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Camera } from "lucide-react";

interface UploadQrCodeProps {
  userId: string;
  target: string;
  onSessionCreated?: (sessionId: string) => void;
  onComplete?: (files: string[]) => void;
}

// Define types for the upload events
interface UploadEvent {
  event_type: string;
  payload?: {
    file_url?: string;
    files?: string[];
  };
}

export function UploadQrCode({ userId, target, onSessionCreated, onComplete }: UploadQrCodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let channel: any;

    if (sessionId) {
      channel = supabase
        .channel(`upload_session_${sessionId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'upload_events',
            filter: `session_id=eq.${sessionId}`,
          },
          (payload) => {
            const event = payload.new as UploadEvent;
            if (event.event_type === 'file_uploaded') {
              const fileUrl = event.payload?.file_url;
              if (fileUrl) {
                setUploadedFiles(prev => [...prev, fileUrl]);
              }
            } else if (event.event_type === 'session_completed') {
              onComplete?.(uploadedFiles);
              setIsOpen(false);
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [sessionId, onComplete, uploadedFiles]);

  const createSession = async () => {
    try {
      const { data, error } = await supabase
        .from('upload_sessions')
        .insert({
          user_id: userId,
          target,
        })
        .select()
        .single();

      if (error) throw error;

      setSessionId(data.session_id);
      onSessionCreated?.(data.session_id);
      setIsOpen(true);
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Fehler",
        description: "Session konnte nicht erstellt werden",
        variant: "destructive"
      });
    }
  };

  const qrCodeValue = sessionId ? 
    JSON.stringify({
      sessionId,
      userId,
      target
    }) : "";

  return (
    <>
      <Button onClick={createSession} variant="outline">
        <Camera className="h-4 w-4 mr-2" />
        Mit Kamera aufnehmen
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR-Code scannen</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-6 py-4">
            {qrCodeValue && (
              <QRCodeSVG 
                value={qrCodeValue}
                size={256}
                includeMargin
                level="M"
              />
            )}

            <div className="text-sm text-muted-foreground text-center">
              Scanne den QR-Code mit deinem Smartphone, um Fotos aufzunehmen
            </div>

            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-4 gap-2 w-full">
                {uploadedFiles.map((url, idx) => (
                  <img 
                    key={idx}
                    src={url} 
                    alt={`Upload ${idx + 1}`}
                    className="w-full h-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
