
import { useEffect, useState } from "react";
import { Star, Award, Shield, ShieldCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ratingService } from "@/services/ratingService";

interface UserRatingProps {
  userId: string;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

const UserRating = ({ userId, size = "md", showBadge = true }: UserRatingProps) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const userRatings = await ratingService.getUserRatings(userId);
        setAverageRating(userRatings.average);
        setRatingCount(userRatings.count);
      } catch (error) {
        console.error("Error fetching user ratings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [userId]);

  // Get star size based on the size prop
  const getStarSize = () => {
    switch (size) {
      case "sm": return 12;
      case "lg": return 20;
      default: return 16;
    }
  };

  const starSize = getStarSize();

  // Get trust badge based on average rating
  const getTrustBadge = () => {
    if (!averageRating || ratingCount < 3) return null;
    
    if (averageRating >= 4.8) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Vertrauenswürdig</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hervorragende Bewertungen von vielen Nutzern</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (averageRating >= 4.5) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                <Shield className="h-3.5 w-3.5" />
                <span>Empfohlen</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sehr gute Bewertungen von mehreren Nutzern</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (averageRating >= 4.0) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
                <Award className="h-3.5 w-3.5" />
                <span>Zuverlässig</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Gute Bewertungen von mehreren Nutzern</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return null;
  };

  if (isLoading) {
    return <div className="flex items-center h-6 animate-pulse bg-gray-200 rounded w-20"></div>;
  }

  if (averageRating === null) {
    return <span className="text-gray-500 text-sm">Keine Bewertungen</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          // Calculate filled proportion for partial stars
          const filled = Math.max(0, Math.min(1, averageRating - (star - 1)));
          
          return (
            <div key={star} className="relative">
              {/* Background star (gray) */}
              <Star 
                size={starSize} 
                className="text-gray-300" 
              />
              
              {/* Filled star overlay */}
              {filled > 0 && (
                <div 
                  className="absolute top-0 left-0 overflow-hidden" 
                  style={{ width: `${filled * 100}%` }}
                >
                  <Star 
                    size={starSize} 
                    className="fill-yellow-400 text-yellow-400" 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <span className="text-sm text-gray-600">
        {averageRating.toFixed(1)} ({ratingCount})
      </span>
      
      {showBadge && getTrustBadge()}
    </div>
  );
};

export default UserRating;
