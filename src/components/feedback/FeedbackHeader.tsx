
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FeedbackHeaderProps {
  isSubmitted?: boolean;
}

const FeedbackHeader = ({ isSubmitted = false }: FeedbackHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <Link to="/">
        <Button variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-2">
        {t(isSubmitted ? "feedback.header.submitted_title" : "feedback.header.title")}
      </h1>
      <p className="text-gray-600 mb-4">
        {t(isSubmitted ? "feedback.header.submitted_description" : "feedback.header.description")}
      </p>
    </div>
  );
};

export default FeedbackHeader;
