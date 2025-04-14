
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type FeedbackTypeOption = {
  value: string;
  label: string;
}

interface FeedbackTypesProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  options?: FeedbackTypeOption[];
}

const defaultOptions: FeedbackTypeOption[] = [
  { value: "suggestion", label: "Suggestion" },
  { value: "bug", label: "Bug Report" },
  { value: "compliment", label: "Compliment" },
  { value: "question", label: "Question" },
];

const FeedbackTypes = ({ 
  selectedType, 
  onTypeChange, 
  options = defaultOptions 
}: FeedbackTypesProps) => {
  return (
    <div className="space-y-2">
      <Label>What type of feedback do you have?</Label>
      <RadioGroup
        value={selectedType}
        onValueChange={onTypeChange}
        className="flex flex-col space-y-1"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FeedbackTypes;
