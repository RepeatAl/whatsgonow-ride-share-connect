
import { Star } from "lucide-react";

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
      {[...Array(maxRating)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : i < rating && i + 1 > rating
              ? "fill-yellow-400 text-yellow-400 opacity-60" // For partial stars (though this is simplified)
              : showEmpty
              ? "text-gray-300"
              : "hidden"
          }`}
        />
      ))}
    </div>
  );
};
