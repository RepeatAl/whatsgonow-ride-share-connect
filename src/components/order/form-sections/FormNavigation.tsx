
import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface FormNavigationProps {
  onSaveDraft: () => Promise<void>;
  isSaving: boolean;
}

export const FormNavigation = ({ onSaveDraft, isSaving }: FormNavigationProps) => {
  return (
    <div className="flex justify-end items-center mb-4">
      <Button
        type="button"
        variant="secondary"
        onClick={onSaveDraft}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <LoadingSpinner size="small" />
            <span className="ml-2">Speichert...</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Als Entwurf speichern
          </>
        )}
      </Button>
    </div>
  );
};
