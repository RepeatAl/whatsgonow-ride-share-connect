
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Wird erstellt...</>
        ) : (
          "Auftrag erstellen"
        )}
      </Button>
    </div>
  );
};
