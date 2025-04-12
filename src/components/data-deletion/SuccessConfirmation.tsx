
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessConfirmationProps {
  title?: string;
  message?: string;
  ctaText?: string;
  ctaLink?: string;
}

const SuccessConfirmation = ({
  title = "Request Submitted Successfully",
  message = "We have received your data deletion request. Our team will process your request within 30 days and contact you via email with updates.",
  ctaText = "Return to Home",
  ctaLink = "/"
}: SuccessConfirmationProps) => {
  const [referenceId, setReferenceId] = useState("");
  
  useEffect(() => {
    // Generate a random reference ID that's consistently formatted
    const id = Math.random().toString(36).substring(2, 10).toUpperCase();
    setReferenceId(id);
  }, []);

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <Check className="h-6 w-6 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold mb-2">
        {title}
      </h2>
      <p className="text-gray-600 mb-4">
        {message}
      </p>
      <p className="text-gray-600 mb-4">Reference ID: {referenceId}</p>
      <Button asChild>
        <Link to={ctaLink}>{ctaText}</Link>
      </Button>
    </div>
  );
};

export default SuccessConfirmation;
