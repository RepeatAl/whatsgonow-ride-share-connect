
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageSquare, Bug, Star, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export type FeedbackTypeOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface FeedbackTypesProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const FeedbackTypes = ({ selectedType, onTypeChange }: FeedbackTypesProps) => {
  const { t } = useTranslation();

  const defaultOptions: FeedbackTypeOption[] = [
    { value: "suggestion", label: t("feedback.form.types.suggestion"), icon: <MessageSquare className="h-4 w-4 text-blue-500" /> },
    { value: "bug", label: t("feedback.form.types.bug"), icon: <Bug className="h-4 w-4 text-red-500" /> },
    { value: "compliment", label: t("feedback.form.types.compliment"), icon: <Star className="h-4 w-4 text-yellow-500" /> },
    { value: "question", label: t("feedback.form.types.question"), icon: <HelpCircle className="h-4 w-4 text-green-500" /> },
  ];

  return (
    <div className="space-y-2">
      <Label>{t("feedback.form.type_label")}</Label>
      <RadioGroup
        value={selectedType}
        onValueChange={onTypeChange}
        className="flex flex-col space-y-1"
      >
        {defaultOptions.map((option) => (
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
