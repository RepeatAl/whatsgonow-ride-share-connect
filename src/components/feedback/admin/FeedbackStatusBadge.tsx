
import { Badge } from "@/components/ui/badge";
import { Check, Clock, MessageCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type FeedbackStatus = "open" | "in_progress" | "resolved";

interface FeedbackStatusBadgeProps {
  status: FeedbackStatus;
}

export const FeedbackStatusBadge = ({ status }: FeedbackStatusBadgeProps) => {
  const { t } = useTranslation();

  const statusConfig = {
    open: {
      icon: <AlertCircle className="h-3 w-3" />,
      className: "bg-red-500 text-white hover:bg-red-600",
      label: t("feedback.status.open"),
    },
    in_progress: {
      icon: <Clock className="h-3 w-3" />,
      className: "bg-orange-400 text-white hover:bg-orange-500",
      label: t("feedback.status.in_progress"),
    },
    resolved: {
      icon: <Check className="h-3 w-3" />,
      className: "bg-green-500 text-white hover:bg-green-600",
      label: t("feedback.status.resolved"),
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={`flex items-center gap-1 ${config.className}`}>
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
};
