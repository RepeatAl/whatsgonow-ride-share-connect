
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  onClick?: () => Promise<void>;
}

export const SubmitButton = ({ isSubmitting, onClick }: SubmitButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button 
        type={onClick ? "button" : "submit"} 
        size="lg" 
        disabled={isSubmitting}
        onClick={onClick}
      >
        {isSubmitting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Wird erstellt...</>
        ) : (
          "Auftrag erstellen"
        )}
      </Button>
    </div>
  );
};
