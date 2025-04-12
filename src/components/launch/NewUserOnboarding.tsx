
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckSquare, Info, Star } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface NewUserOnboardingProps {
  onComplete: () => void;
}

const NewUserOnboarding = ({ onComplete }: NewUserOnboardingProps) => {
  const [open, setOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      title: "Welcome to Whatsgonow!",
      description: "Discover a new way to send packages and earn money while traveling.",
      icon: <Star className="h-12 w-12 text-brand-purple mb-4" />,
    },
    {
      title: "How it works",
      description: "Connect with travelers heading to your destination and send packages easily and affordably.",
      icon: <Info className="h-12 w-12 text-brand-blue mb-4" />,
    },
    {
      title: "Ready to get started?",
      description: "Start by creating an order or offering your transport services to others.",
      icon: <CheckSquare className="h-12 w-12 text-green-500 mb-4" />,
    },
  ];

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
            Skip
          </Button>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? "Next" : "Get Started"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewUserOnboarding;
