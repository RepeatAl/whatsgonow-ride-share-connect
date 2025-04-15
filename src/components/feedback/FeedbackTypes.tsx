
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageSquare, Bug, Star, HelpCircle } from "lucide-react";

export type FeedbackTypeOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface FeedbackTypesProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  options?: FeedbackTypeOption[];
}

const defaultOptions: FeedbackTypeOption[] = [
  { value: "suggestion", label: "Vorschlag", icon: <MessageSquare className="h-4 w-4 text-blue-500" /> },
  { value: "bug", label: "Fehlerbericht", icon: <Bug className="h-4 w-4 text-red-500" /> },
  { value: "compliment", label: "Kompliment", icon: <Star className="h-4 w-4 text-yellow-500" /> },
  { value: "question", label: "Frage", icon: <HelpCircle className="h-4 w-4 text-green-500" /> },
];

const FeedbackTypes = ({ 
  selectedType, 
  onTypeChange, 
  options = defaultOptions 
}: FeedbackTypesProps) => {
  return (
    <div className="space-y-2">
      <Label>Welche Art von Feedback haben Sie?</Label>
      <RadioGroup
        value={selectedType}
        onValueChange={onTypeChange}
        className="flex flex-col space-y-1"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <div className="flex items-center gap-2">
              {option.icon}
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FeedbackTypes;
