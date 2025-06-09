
import React, { useState, useEffect } from 'react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, User, Phone, MapPin, Building } from 'lucide-react';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

const ProfileCompletion = () => {
  const { user, profile, loading } = useOptimizedAuth();
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();

  useEffect(() => {
    if (!loading && user && profile) {
      // HARMONISIERT: Einheitliche Validierung für Pflichtfelder
      const requiredFields = [
        { key: 'first_name', label: 'Vorname', icon: User },
        { key: 'last_name', label: 'Nachname', icon: User },
        { key: 'phone', label: 'Telefonnummer', icon: Phone },
        { key: 'postal_code', label: 'Postleitzahl', icon: MapPin },
        { key: 'city', label: 'Stadt', icon: MapPin },
        { key: 'region', label: 'Region', icon: MapPin },
        { key: 'street', label: 'Straße', icon: MapPin },
        { key: 'house_number', label: 'Hausnummer', icon: MapPin },
      ];

      // Zusätzliche Validierung für Business-Nutzer
      if (profile.role === 'sender_business') {
        requiredFields.push({ key: 'company_name', label: 'Firmenname', icon: Building });
      }

      const missing = requiredFields.filter(field => {
        const value = profile[field.key as keyof typeof profile];
        return !value || (typeof value === 'string' && value.trim() === '');
      });

      setMissingFields(missing.map(field => field.label));
    }
  }, [user, profile, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Sie sind nicht angemeldet. Bitte melden Sie sich an, um fortzufahren.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isComplete = missingFields.length === 0;

  const handleCompleteProfile = () => {
    navigate(getLocalizedUrl('/profile'));
  };

  const handleGoToDashboard = () => {
    navigate(getLocalizedUrl('/dashboard'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          )}
          Profil Vervollständigen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isComplete ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <p className="font-medium">
                Ihr Profil ist vollständig ausgefüllt!
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Sie können jetzt alle Funktionen der Plattform nutzen.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleGoToDashboard} className="flex-1">
                Zum Dashboard
              </Button>
              <Button variant="outline" onClick={handleCompleteProfile}>
                Profil bearbeiten
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <p className="font-medium">
                Bitte vervollständigen Sie Ihr Profil
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Folgende Angaben fehlen noch:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                {missingFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </div>
            <Button onClick={handleCompleteProfile} className="w-full">
              Profil vervollständigen
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletion;
