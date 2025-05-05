
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

type Props = {
  open: boolean;
  onClose: (findDriver: boolean) => void;
};

export function FindDriverDialog({ open, onClose }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={() => onClose(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Auftrag erfolgreich erstellt!</AlertDialogTitle>
          <AlertDialogDescription>
            Möchten Sie jetzt einen passenden Fahrer für Ihren Transport finden?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose(false)}>
            Nein, später
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onClose(true)}>
            Ja, Fahrer suchen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
