import React, { useState } from 'react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUpload } from '@/components/ui/file-upload';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const DriverIDVerification = () => {
  const { user, profile } = useOptimizedAuth();
  const [idNumber, setIdNumber] = useState('');
  const [idType, setIdType] = useState('national_id');
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!frontImage || !backImage || !selfieImage) {
      setError('Bitte lade alle erforderlichen Bilder hoch');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Here would be the actual verification logic
      // For example, uploading to a secure storage and creating verification request
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Fehler bei der Verifizierung');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Verifizierung eingereicht
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Deine Ausweisdokumente wurden erfolgreich hochgeladen und werden nun überprüft.
            Dieser Vorgang kann bis zu 24 Stunden dauern.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fahrer-Identitätsverifizierung</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="idType">Ausweistyp</Label>
            <select
              id="idType"
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="national_id">Personalausweis</option>
              <option value="passport">Reisepass</option>
              <option value="drivers_license">Führerschein</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber">Ausweisnummer</Label>
            <Input
              id="idNumber"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Gib deine Ausweisnummer ein"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Vorderseite des Ausweises</Label>
            <FileUpload
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              onFileSelected={setFrontImage}
            />
          </div>

          <div className="space-y-2">
            <Label>Rückseite des Ausweises</Label>
            <FileUpload
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              onFileSelected={setBackImage}
            />
          </div>

          <div className="space-y-2">
            <Label>Selfie mit Ausweis</Label>
            <FileUpload
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              onFileSelected={setSelfieImage}
            />
            <p className="text-xs text-muted-foreground">
              Bitte halte deinen Ausweis neben dein Gesicht und mache ein Foto.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="pt-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Wird verarbeitet...' : 'Verifizierung einreichen'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DriverIDVerification;
