
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { Camera, CheckCircle2, AlertCircle, UploadCloud, RefreshCw } from "lucide-react";

interface VerificationResponse {
  success: boolean;
  verified: boolean;
  message: string;
  confidence?: number;
  issues?: string[];
}

export function DriverIDVerification() {
  const { user, profile, refreshProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  
  if (!user || !profile) return null;
  
  // Don't show if already verified
  if (profile.id_photo_verified) {
    return (
      <Card className="border-green-100 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            ID-Foto verifiziert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Deine Identität wurde erfolgreich verifiziert. Du kannst nun alle Fahrerfunktionen nutzen.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const uploadIDPhoto = async (file: File) => {
    if (!user) {
      toast({
        title: "Fehler",
        description: "Du musst angemeldet sein, um ein ID-Foto hochzuladen.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 300);
      
      // Generate unique file name
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${timestamp}.${fileExt}`;
      const filePath = fileName;
      
      // Upload to Supabase storage
      const { data, error } = await supabase
        .storage
        .from('driver-verification')
        .upload(filePath, file);
      
      clearInterval(progressInterval);
      
      if (error) {
        throw error;
      }
      
      setUploadProgress(100);
      
      // Get public URL of uploaded file
      const { data: urlData } = await supabase
        .storage
        .from('driver-verification')
        .getPublicUrl(filePath);
        
      // Call verification function
      await verifyIDPhoto(urlData.publicUrl);
      
    } catch (error) {
      console.error("Error uploading ID photo:", error);
      toast({
        title: "Fehler beim Hochladen",
        description: error.message || "Dein ID-Foto konnte nicht hochgeladen werden. Bitte versuche es später erneut.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const verifyIDPhoto = async (photoUrl: string) => {
    try {
      setVerifying(true);
      setVerificationResult(null);
      
      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/verify-id-photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          userId: user.id,
          photoUrl
        })
      });
      
      const result: VerificationResponse = await response.json();
      
      setVerificationResult(result);
      
      if (result.verified) {
        toast({
          title: "Verifizierung erfolgreich",
          description: "Dein ID-Foto wurde erfolgreich verifiziert.",
        });
        
        if (refreshProfile) {
          // Refresh profile to update verification status
          await refreshProfile();
        }
      } else {
        toast({
          title: "Verifizierung fehlgeschlagen",
          description: result.issues?.[0] || "Dein ID-Foto konnte nicht verifiziert werden. Bitte versuche es erneut.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error("Error verifying ID photo:", error);
      toast({
        title: "Fehler bei der Verifizierung",
        description: "Dein ID-Foto konnte nicht verifiziert werden. Bitte versuche es später erneut.",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };
  
  const handleRetry = () => {
    setVerificationResult(null);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>ID-Foto hochladen</CardTitle>
        <CardDescription>
          Für die Verifizierung als Fahrer benötigen wir ein Foto deines Ausweises.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {verificationResult ? (
          <>
            {verificationResult.verified ? (
              <Alert className="bg-green-50 border-green-200 mb-4">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <AlertTitle>Verifizierung erfolgreich</AlertTitle>
                <AlertDescription>
                  Dein ID-Foto wurde erfolgreich verifiziert und deine Identität wurde bestätigt.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-amber-50 border-amber-200 mb-4">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <AlertTitle>Verifizierung fehlgeschlagen</AlertTitle>
                <AlertDescription>
                  {verificationResult.issues?.map((issue, i) => (
                    <div key={i} className="mt-1">{issue}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}
            
            {!verificationResult.verified && (
              <Button 
                onClick={handleRetry} 
                className="mt-2"
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Erneut versuchen
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Bitte lade ein gut belichtetes Foto deines Personalausweises oder Führerscheins hoch.
                Stelle sicher, dass alle Informationen deutlich lesbar sind.
              </p>
              
              {(uploading || verifying) && (
                <div className="my-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{uploading ? "Lädt hoch..." : "Verifiziert..."}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              
              {!uploading && !verifying && (
                <div className="mt-4">
                  <FileUploader
                    onFileSelected={uploadIDPhoto}
                    accept="image/*"
                    maxSize={5}
                  >
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-center font-medium">Klicken oder ziehen zum Hochladen</p>
                      <p className="text-xs text-center text-muted-foreground mt-1">
                        Unterstützt werden JPG, PNG bis 5 MB
                      </p>
                    </div>
                  </FileUploader>
                  
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" className="mx-auto">
                      <Camera className="mr-2 h-4 w-4" />
                      Foto aufnehmen
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
