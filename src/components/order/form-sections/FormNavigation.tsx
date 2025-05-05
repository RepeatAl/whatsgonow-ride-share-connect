
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface FormNavigationProps {
  onSaveDraft: () => Promise<void>;
  isSaving: boolean;
}

export const FormNavigation = ({ onSaveDraft, isSaving }: FormNavigationProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Zurück
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={onSaveDraft}
        disabled={isSaving}
        className="mb-4"
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
