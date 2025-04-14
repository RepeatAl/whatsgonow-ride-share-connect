
import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showEmpty?: boolean;
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
  showEmpty = true,
}: StarRatingProps) => {
  // Size classes for different star sizes
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const difference = starValue - rating;

        // Full star
        if (difference <= 0) {
          return (
            <Star
              key={i}
              className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
            />
          );
        }
        // Half star (difference between 0 and 0.5)
        else if (difference > 0 && difference < 0.8) {
          return (
            <div key={i} className="relative">
              {/* Background star (empty) */}
              <Star
                className={`${sizeClasses[size]} ${showEmpty ? "text-gray-300" : "hidden"}`}
              />
              {/* Half star overlay */}
              <div className="absolute top-0 left-0 overflow-hidden w-[50%]">
                <Star
                  className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
                />
              </div>
            </div>
          );
        }
        // Empty star
        else {
          return (
            <Star
              key={i}
              className={`${sizeClasses[size]} ${showEmpty ? "text-gray-300" : "hidden"}`}
            />
          );
        }
      })}
    </div>
  );
};
