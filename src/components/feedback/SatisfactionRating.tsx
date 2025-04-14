
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/rating/StarRating";

interface SatisfactionRatingProps {
  satisfaction: string;
  onChange: (rating: string) => void;
}

const SatisfactionRating = ({ satisfaction, onChange }: SatisfactionRatingProps) => {
  return (
    <div className="space-y-2">
      <Label>How satisfied are you with Whatsgonow?</Label>
      <div className="flex items-center space-x-1">
        <StarRating 
          rating={parseInt(satisfaction)} 
          size="lg" 
          interactive={true}
          onChange={(newRating) => onChange(newRating.toString())}
        />
      </div>
    </div>
  );
};

export default SatisfactionRating;
