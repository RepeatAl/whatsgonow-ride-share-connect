
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
import { useNavigate } from 'react-router-dom';

type Props = {
  open: boolean;
  onClose: (findDriver: boolean) => void;
};

export function FindDriverDialog({ open, onClose }: Props) {
  const navigate = useNavigate();

  const handleFindDriver = () => {
    onClose(true);
    navigate("/find-driver", { 
      state: { 
        fromNewOrder: true,
        useAddressBook: true 
      } 
    });
  };

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
          <AlertDialogAction onClick={handleFindDriver}>
            Ja, Fahrer suchen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
