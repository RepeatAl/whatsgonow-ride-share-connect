
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface FeedbackFiltersProps {
  selectedStatus: string;
  selectedType: string;
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
}

export const FeedbackFilters = ({
  selectedStatus,
  selectedType,
  onStatusChange,
  onTypeChange,
}: FeedbackFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("feedback.filter.status.label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("feedback.filter.all")}</SelectItem>
          <SelectItem value="open">{t("feedback.filter.status.open")}</SelectItem>
          <SelectItem value="in_progress">
            {t("feedback.filter.status.in_progress")}
          </SelectItem>
          <SelectItem value="resolved">
            {t("feedback.filter.status.resolved")}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("feedback.filter.type.label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("feedback.filter.type.all")}</SelectItem>
          <SelectItem value="suggestion">
            {t("feedback.filter.type.suggestion")}
          </SelectItem>
          <SelectItem value="bug">{t("feedback.filter.type.bug")}</SelectItem>
          <SelectItem value="compliment">
            {t("feedback.filter.type.compliment")}
          </SelectItem>
          <SelectItem value="question">
            {t("feedback.filter.type.question")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
