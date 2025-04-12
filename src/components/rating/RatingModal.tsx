
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Star } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ratingService } from "@/services/ratingService";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  orderId: string;
  userName: string;
}

type FormValues = {
  comment: string;
};

const RatingModal = ({ isOpen, onClose, userId, orderId, userName }: RatingModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      comment: ""
    }
  });

  const handleRatingSubmit = async (data: FormValues) => {
    if (rating === 0) {
      toast({
        title: "Bewertung erforderlich",
        description: "Bitte geben Sie eine Sternebewertung ab.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit rating to service
      await ratingService.submitRating({
        userId,
        orderId,
        rating,
        comment: data.comment
      });
      
      toast({
        title: "Bewertung gesendet",
        description: `Sie haben ${userName} mit ${rating} Sternen bewertet.`
      });
      
      // Reset form and close modal
      reset();
      setRating(0);
      onClose();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Bewertung konnte nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bewerten Sie {userName}</DialogTitle>
          <DialogDescription>
            Teilen Sie Ihre Erfahrung mit anderen Nutzern.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleRatingSubmit)}>
          <div className="py-4">
            <div className="flex justify-center items-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star 
                    size={32} 
                    className={`${
                      (hoveredRating ? hoveredRating >= star : rating >= star) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                    } cursor-pointer transition-colors`} 
                  />
                </button>
              ))}
            </div>
            
            <Textarea
              {...register("comment")}
              placeholder="Ihr Kommentar (optional)"
              className="resize-none"
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Wird gesendet..." : "Bewertung senden"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
