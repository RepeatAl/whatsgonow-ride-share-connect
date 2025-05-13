
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Send, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FormNavigationProps {
  onSaveDraft: () => void;
  onSubmitForm: () => void;
  onClearForm: () => void;
  isSaving: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  isAuthenticated: boolean;
  imageCount?: number;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  onSaveDraft,
  onSubmitForm,
  onClearForm,
  isSaving,
  isSubmitting,
  isValid,
  isAuthenticated,
  imageCount = 0
}) => {
  const navigate = useNavigate();
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  
  // Check if we have enough images for publication (minimum 2)
  const hasEnoughImages = imageCount >= 2;
  
  const handleSubmit = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/create-order");
      return;
    }
    
    if (!hasEnoughImages) {
      // Display warning but allow to proceed
      onSubmitForm();
      return;
    }
    
    onSubmitForm();
  };

  return (
    <div className="bg-white sticky top-0 z-10 py-3 border-b flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowClearDialog(true)}
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Formular leeren
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSaving}
          size="sm"
        >
          <Save className="h-4 w-4 mr-1" />
          Als Entwurf speichern
        </Button>
        
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !isValid}
          size="sm"
        >
          <Send className="h-4 w-4 mr-1" />
          {hasEnoughImages 
            ? "Auftrag veröffentlichen" 
            : "Als Entwurf speichern"}
        </Button>
      </div>

      {/* Bestätigungsdialog für Formular-Reset */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Formular leeren?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Alle
              eingegebenen Daten werden gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              onClearForm();
              setShowClearDialog(false);
            }}>
              Formular leeren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
