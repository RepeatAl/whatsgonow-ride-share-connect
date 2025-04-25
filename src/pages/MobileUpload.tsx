
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Check } from "lucide-react";
import { useUploadSession } from "@/hooks/useUploadSession";
import { useUploadHandler } from "@/hooks/useUploadHandler";
import { UploadProgress } from "@/components/upload/UploadProgress";

export default function MobileUpload() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { session, error: sessionError, isLoading } = useUploadSession(sessionId!);
  const { uploadFile, isUploading, error: uploadError } = 
    useUploadHandler({ 
      sessionId: sessionId!, 
      onProgress: setUploadProgress 
    });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !session) return;

    try {
      for (let i = 0; i < Math.min(files.length, 4 - uploadedFiles.length); i++) {
        const file = files[i];
        const publicUrl = await uploadFile(file);
        setUploadedFiles(prev => [...prev, publicUrl]);
      }
    } catch (err) {
      console.error('Upload error:', err);
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
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <Card className="mx-auto max-w-md mt-8">
        <CardHeader>
          <CardTitle className="text-red-500">Fehler</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{sessionError}</p>
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
                alt={`Aufnahme ${idx + 1}`}
                className="w-full aspect-square object-cover rounded"
              />
            ))}
          </div>

          {uploadedFiles.length < 4 && (
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                disabled={isUploading}
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
                    disabled={isUploading}
                  />
                </label>
              </Button>

              {isUploading && (
                <UploadProgress 
                  current={uploadedFiles.length} 
                  total={4} 
                  progress={uploadProgress} 
                />
              )}
              
              <span className="text-sm text-muted-foreground">
                {uploadedFiles.length}/4 Fotos aufgenommen
              </span>
            </div>
          )}

          {uploadError && (
            <p className="text-sm text-red-500 text-center">{uploadError}</p>
          )}

          {uploadedFiles.length > 0 && (
            <Button 
              onClick={completeSession}
              className="w-full"
              disabled={isUploading}
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
