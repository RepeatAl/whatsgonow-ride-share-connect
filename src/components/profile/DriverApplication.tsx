import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Upload, Check, AlertCircle } from 'lucide-react';

const DriverApplication = () => {
  const { user, profile, refreshProfile } = useSimpleAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    drivingExperience: '',
    vehicleType: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    hasCommercialLicense: false,
    availability: '',
    preferredRegions: '',
    additionalInfo: '',
  });
  const [applicationStatus, setApplicationStatus] = useState('');
  const [documentUploaded, setDocumentUploaded] = useState(false);

  useEffect(() => {
    if (user) {
      fetchApplicationStatus();
    }
  }, [user]);

  const fetchApplicationStatus = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('driver_applications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching application:', error);
        return;
      }

      if (data) {
        setApplicationStatus(data.status);
        setFormData({
          drivingExperience: data.driving_experience || '',
          vehicleType: data.vehicle_type || '',
          vehicleMake: data.vehicle_make || '',
          vehicleModel: data.vehicle_model || '',
          vehicleYear: data.vehicle_year || '',
          licensePlate: data.license_plate || '',
          hasCommercialLicense: data.has_commercial_license || false,
          availability: data.availability || '',
          preferredRegions: data.preferred_regions || '',
          additionalInfo: data.additional_info || '',
        });
        setDocumentUploaded(!!data.documents_uploaded);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;

    const file = e.target.files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Datei zu groß",
        description: "Die Datei darf maximal 5 MB groß sein.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const filePath = `driver-documents/${user.id}/${file.name}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('driver-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Update application record to indicate document was uploaded
      const { error: updateError } = await supabase
        .from('driver_applications')
        .update({ documents_uploaded: true })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setDocumentUploaded(true);
      toast({
        title: "Dokument hochgeladen",
        description: "Dein Dokument wurde erfolgreich hochgeladen.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Fehler beim Hochladen",
        description: "Das Dokument konnte nicht hochgeladen werden. Bitte versuche es erneut.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('driver_applications')
        .upsert({
          user_id: user.id,
          driving_experience: formData.drivingExperience,
          vehicle_type: formData.vehicleType,
          vehicle_make: formData.vehicleMake,
          vehicle_model: formData.vehicleModel,
          vehicle_year: formData.vehicleYear,
          license_plate: formData.licensePlate,
          has_commercial_license: formData.hasCommercialLicense,
          availability: formData.availability,
          preferred_regions: formData.preferredRegions,
          additional_info: formData.additionalInfo,
          status: applicationStatus || 'pending',
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      if (!applicationStatus) {
        setApplicationStatus('pending');
      }

      toast({
        title: "Bewerbung gespeichert",
        description: "Deine Fahrerbewerbung wurde erfolgreich gespeichert.",
      });

      // Refresh profile to get updated role if application was approved
      refreshProfile();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Fehler",
        description: "Deine Bewerbung konnte nicht gespeichert werden. Bitte versuche es später erneut.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = () => {
    switch (applicationStatus) {
      case 'approved':
        return (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <Check className="h-4 w-4" />
            <span>Genehmigt</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full">
            <AlertCircle className="h-4 w-4" />
            <span>Abgelehnt</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>In Bearbeitung</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Du musst angemeldet sein, um dich als Fahrer zu bewerben.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Fahrerbewerbung</CardTitle>
        {applicationStatus && renderStatusBadge()}
      </CardHeader>
      <CardContent>
        {applicationStatus === 'rejected' ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <h3 className="font-medium text-red-800">Deine Bewerbung wurde abgelehnt</h3>
            <p className="text-red-700 mt-1">
              Leider können wir deine Bewerbung zum jetzigen Zeitpunkt nicht annehmen. 
              Bitte kontaktiere den Support für weitere Informationen.
            </p>
          </div>
        ) : applicationStatus === 'approved' ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h3 className="font-medium text-green-800">Deine Bewerbung wurde genehmigt!</h3>
            <p className="text-green-700 mt-1">
              Du kannst jetzt als Fahrer auf der Plattform aktiv werden und Transportaufträge annehmen.
            </p>
          </div>
        ) : (
          <p className="mb-6">
            Fülle das Formular aus, um dich als Fahrer zu bewerben. Nach der Prüfung deiner Angaben werden wir dich benachrichtigen.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="drivingExperience">Fahrerfahrung (Jahre)</Label>
              <Input
                id="drivingExperience"
                name="drivingExperience"
                value={formData.drivingExperience}
                onChange={handleInputChange}
                disabled={loading || applicationStatus === 'approved'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Fahrzeugtyp</Label>
              <Select 
                value={formData.vehicleType} 
                onValueChange={(value) => handleSelectChange('vehicleType', value)}
                disabled={loading || applicationStatus === 'approved'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wähle einen Fahrzeugtyp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">PKW</SelectItem>
                  <SelectItem value="van">Transporter</SelectItem>
                  <SelectItem value="truck">LKW</SelectItem>
                  <SelectItem value="other">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleMake">Fahrzeugmarke</Label>
              <Input
                id="vehicleMake"
                name="vehicleMake"
                value={formData.vehicleMake}
                onChange={handleInputChange}
                disabled={loading || applicationStatus === 'approved'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Fahrzeugmodell</Label>
              <Input
                id="vehicleModel"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleInputChange}
                disabled={loading || applicationStatus === 'approved'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Baujahr</Label>
              <Input
                id="vehicleYear"
                name="vehicleYear"
                value={formData.vehicleYear}
                onChange={handleInputChange}
                disabled={loading || applicationStatus === 'approved'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">Kennzeichen</Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleInputChange}
                disabled={loading || applicationStatus === 'approved'}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hasCommercialLicense" 
              checked={formData.hasCommercialLicense}
              onCheckedChange={(checked) => handleCheckboxChange('hasCommercialLicense', checked === true)}
              disabled={loading || applicationStatus === 'approved'}
            />
            <Label htmlFor="hasCommercialLicense">Ich besitze eine gewerbliche Fahrerlaubnis</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Verfügbarkeit</Label>
            <Select 
              value={formData.availability} 
              onValueChange={(value) => handleSelectChange('availability', value)}
              disabled={loading || applicationStatus === 'approved'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wähle deine Verfügbarkeit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Vollzeit</SelectItem>
                <SelectItem value="part-time">Teilzeit</SelectItem>
                <SelectItem value="weekends">Nur Wochenende</SelectItem>
                <SelectItem value="flexible">Flexibel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredRegions">Bevorzugte Regionen</Label>
            <Input
              id="preferredRegions"
              name="preferredRegions"
              value={formData.preferredRegions}
              onChange={handleInputChange}
              placeholder="z.B. Berlin, Hamburg, München"
              disabled={loading || applicationStatus === 'approved'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Zusätzliche Informationen</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Weitere relevante Informationen zu deiner Bewerbung"
              disabled={loading || applicationStatus === 'approved'}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentUpload">Führerschein hochladen (PDF, max. 5MB)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="documentUpload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={loading || documentUploaded || applicationStatus === 'approved'}
                className="max-w-sm"
              />
              {documentUploaded && (
                <div className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span>Dokument hochgeladen</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Bitte lade eine Kopie deines Führerscheins hoch. Dies wird für die Verifizierung benötigt.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={loading || applicationStatus === 'approved'} 
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird gespeichert...
              </>
            ) : applicationStatus ? 'Bewerbung aktualisieren' : 'Bewerbung einreichen'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DriverApplication;
