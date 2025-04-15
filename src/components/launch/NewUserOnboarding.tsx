
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getOnboardingSteps } from "@/components/onboarding/OnboardingContent";
import { useAuth } from "@/contexts/AuthContext";

interface NewUserOnboardingProps {
  onComplete: () => void;
}

const NewUserOnboarding = ({ onComplete }: NewUserOnboardingProps) => {
  const [open, setOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { profile } = useAuth();
  
  const steps = getOnboardingSteps(profile?.role);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOpen(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    setOpen(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            {steps[currentStep].icon}
            <DialogTitle className="text-xl">{steps[currentStep].title}</DialogTitle>
            <DialogDescription className="mt-2">
              {steps[currentStep].description}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${
                index === currentStep ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleSkip}>
            Überspringen
          </Button>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? "Weiter" : "Los geht's"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewUserOnboarding;
