
import React, { useState } from "react";
import { Save, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface FormNavigationProps {
  onSaveDraft: () => Promise<void>;
  onSubmitForm: () => Promise<void>;
  onClearForm: () => void;
  isSaving: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  isAuthenticated: boolean;
}

export const FormNavigation = ({ 
  onSaveDraft, 
  onSubmitForm,
  onClearForm,
  isSaving, 
  isSubmitting,
  isValid,
  isAuthenticated
}: FormNavigationProps) => {
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Prüfen, ob der Benutzer angemeldet ist
  if (!isAuthenticated) {
    return null;
  }

  const handleClearFormConfirmed = () => {
    onClearForm();
    setShowClearConfirm(false);
    toast.success("Formular wurde zurückgesetzt");
  };

  return (
    <>
      <div className="flex flex-wrap justify-end items-center gap-3 mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowClearConfirm(true)}
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Alle Angaben löschen
        </Button>
        
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
        
        {isValid && (
          <Button
            type="button"
            variant="brand"
            onClick={onSubmitForm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Veröffentlicht...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Artikel veröffentlichen
              </>
            )}
          </Button>
        )}
      </div>
      
      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Formular zurücksetzen"
        description="Möchten Sie wirklich alle eingegebenen Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmLabel="Ja, löschen"
        cancelLabel="Abbrechen"
        onConfirm={handleClearFormConfirmed}
      />
    </>
  );
};
