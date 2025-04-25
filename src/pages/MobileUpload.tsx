
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Check } from "lucide-react";

interface UploadSession {
  sessionId: string;
  userId: string;
  target: string;
  expiresAt: string;
  uploadedFiles: string[];
  completed: boolean;
}

export default function MobileUpload() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<UploadSession | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data, error } = await supabase
          .from('upload_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single();

        if (error) throw error;
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          throw new Error('Session abgelaufen');
        }

        setSession(data);
      } catch (err) {
        setError('Session ungültig oder abgelaufen');
        console.error('Error loading session:', err);
      }
    };

    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !session) return;

    setUploading(true);
    try {
      for (let i = 0; i < Math.min(files.length, 4 - uploadedFiles.length); i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${session.sessionId}/${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName);

        // Create upload event
        await supabase.from('upload_events').insert({
          session_id: session.sessionId,
          event_type: 'file_uploaded',
          payload: { file_url: publicUrl }
        });

        setUploadedFiles(prev => [...prev, publicUrl]);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Fehler beim Hochladen');
    } finally {
      setUploading(false);
    }
  };

  const completeSession = async () => {
    if (!session) return;

    try {
      await supabase.from('upload_events').insert({
        session_id: session.sessionId,
        event_type: 'session_completed',
        payload: { files: uploadedFiles }
      });

      await supabase
        .from('upload_sessions')
        .update({ completed: true })
        .eq('session_id', session.sessionId);

      navigate('/upload-complete');
    } catch (err) {
      console.error('Error completing session:', err);
      setError('Fehler beim Abschließen der Session');
    }
  };

  if (error) {
    return (
      <Card className="mx-auto max-w-md mt-8">
        <CardHeader>
          <CardTitle className="text-red-500">Fehler</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Fotos aufnehmen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {uploadedFiles.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Uploaded ${idx + 1}`}
                className="w-full aspect-square object-cover rounded"
              />
            ))}
          </div>

          {uploadedFiles.length < 4 && (
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                disabled={uploading}
                asChild
              >
                <label>
                  <Camera className="h-4 w-4 mr-2" />
                  Foto aufnehmen
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </Button>
              
              <span className="text-sm text-muted-foreground">
                {uploadedFiles.length}/4 Fotos aufgenommen
              </span>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <Button 
              onClick={completeSession}
              className="w-full"
              disabled={uploading}
            >
              <Check className="h-4 w-4 mr-2" />
              Fertig
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
