
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface NewUserOnboardingProps {
  onComplete: () => void;
}

const NewUserOnboarding = ({ onComplete }: NewUserOnboardingProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-white">
        <CardHeader>
          <CardTitle>Willkommen bei Whatsgonow!</CardTitle>
          <CardDescription>
            Wir freuen uns, dass du Teil unserer Community bist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Whatsgonow ist eine Crowdlogistik-Plattform, die spontane und planbare 
              Transporte zwischen privaten oder kleingewerblichen Auftraggebern und 
              mobilen Fahrer:innen vermittelt.
            </p>
            <p>
              Um alle Funktionen nutzen zu können, solltest du dein Profil vervollständigen.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onComplete}>
            Verstanden, los geht's!
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewUserOnboarding;
