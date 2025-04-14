
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FeedbackTypeSelectorProps {
  feedbackType: string;
  onChange: (type: string) => void;
}

const FeedbackTypeSelector = ({ feedbackType, onChange }: FeedbackTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>What type of feedback do you have?</Label>
      <RadioGroup
        value={feedbackType}
        onValueChange={onChange}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="suggestion" id="suggestion" />
          <Label htmlFor="suggestion">Suggestion</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bug" id="bug" />
          <Label htmlFor="bug">Bug Report</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="compliment" id="compliment" />
          <Label htmlFor="compliment">Compliment</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default FeedbackTypeSelector;
