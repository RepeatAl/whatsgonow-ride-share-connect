import { useEffect, useState } from "react";
import { Star, Award, Shield, ShieldCheck, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ratingService } from "@/services/ratingService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TrustBadge from "@/components/trust/TrustBadge";

interface UserRatingProps {
  userId: string;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  showDetails?: boolean;
  className?: string;
  showTrustScore?: boolean;
}

interface RatingDetail {
  id: string;
  rating: number;
  comment?: string;
  timestamp: Date;
}

const UserRating = ({ 
  userId, 
  size = "md", 
  showBadge = true, 
  showDetails = false, 
  className = "",
  showTrustScore = true
}: UserRatingProps) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showRatingDetails, setShowRatingDetails] = useState(false);
  const [ratingDetails, setRatingDetails] = useState<RatingDetail[]>([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const userRatings = await ratingService.getUserRatings(userId);
        setAverageRating(userRatings.average);
        setRatingCount(userRatings.count);
        
        // Store rating details if available
        if (userRatings.ratings) {
          setRatingDetails(userRatings.ratings.map(r => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            timestamp: new Date(r.timestamp)
          })));
        }
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
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

        {/* Add Trust Score Badge */}
        {showTrustScore && (
          <TrustBadge userId={userId} size={size} />
        )}

        {showDetails && ratingCount > 0 && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => setShowRatingDetails(true)}
          >
            <Info className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Rating Details Dialog */}
      <Dialog open={showRatingDetails} onOpenChange={setShowRatingDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bewertungsübersicht</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{averageRating.toFixed(1)}/5</div>
                <div className="text-sm text-gray-500">Basierend auf {ratingCount} Bewertungen</div>
              </div>
            </div>
            
            {ratingDetails.length > 0 ? (
              <div className="space-y-3">
                {ratingDetails.map(detail => (
                  <div key={detail.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < detail.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(detail.timestamp)}</span>
                    </div>
                    {detail.comment && <p className="text-sm">{detail.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Keine detaillierten Bewertungen verfügbar
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserRating;
