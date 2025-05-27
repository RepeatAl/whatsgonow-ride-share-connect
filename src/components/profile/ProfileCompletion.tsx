import React, { useState, useEffect } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const ProfileCompletion = () => {
  const { user, profile, loading } = useSimpleAuth();
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile) {
      // Check if required profile fields are present
      const requiredFields = ['name', 'email', 'role'];
      const missingFields = requiredFields.filter(field => !profile[field]);
      setIsComplete(missingFields.length === 0);
    }
  }, [user, profile, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated.</div>;
  }

  const handleCompleteProfile = () => {
    navigate('/profile');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Vervollständigen</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isComplete ? (
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <p className="text-sm text-muted-foreground">
              Dein Profil ist vollständig.
            </p>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <p className="text-sm text-muted-foreground">
              Bitte vervollständige dein Profil, um alle Funktionen nutzen zu können.
            </p>
          </div>
        )}
        <Button onClick={handleCompleteProfile} disabled={isComplete}>
          Profil bearbeiten
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletion;

