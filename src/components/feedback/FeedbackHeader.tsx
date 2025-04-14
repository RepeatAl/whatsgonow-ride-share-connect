
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface FeedbackHeaderProps {
  isSubmitted?: boolean;
}

const FeedbackHeader = ({ isSubmitted = false }: FeedbackHeaderProps) => {
  return (
    <div className="mb-6">
      <Link to="/">
        <Button variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-2">
        {isSubmitted ? "Feedback Submitted" : "Share Your Feedback"}
      </h1>
      <p className="text-gray-600 mb-4">
        {isSubmitted
          ? "Thank you for helping us improve Whatsgonow!"
          : "Help us improve Whatsgonow by sharing your experience"}
      </p>
    </div>
  );
};

export default FeedbackHeader;
