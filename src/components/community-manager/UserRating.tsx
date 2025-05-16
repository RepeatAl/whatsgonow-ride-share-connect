
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

export interface UserRatingProps {
  rating: number;
  showAlert?: boolean;
}

const UserRating: React.FC<UserRatingProps> = ({ rating, showAlert = true }) => {
  const getRatingColor = (score: number) => {
    if (score >= 4) return "text-green-500";
    if (score >= 3) return "text-blue-500";
    return "text-amber-500";
  };

  if (rating > 0) {
    return (
      <div className="flex items-center">
        <span className={`font-medium ${getRatingColor(rating)}`}>
          {rating}
        </span>
        <span className="text-muted-foreground ml-1">
          ★
        </span>
        
        {showAlert && rating < 3 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="h-4 w-4 text-amber-500 ml-1" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Dieser Nutzer hat niedrige Bewertungen.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }
  
  return (
    <span className="text-muted-foreground text-sm">
      Neu
    </span>
  );
};

export default UserRating;
