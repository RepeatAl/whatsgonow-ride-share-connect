
import React from "react";

interface UserRatingProps {
  rating: number;
}

const UserRating: React.FC<UserRatingProps> = ({ rating }) => {
  if (rating > 0) {
    return (
      <div className="flex items-center">
        <span className={`font-medium ${
          rating >= 4 ? "text-green-500" : 
          rating >= 3 ? "text-blue-500" : 
          "text-amber-500"
        }`}>
          {rating}
        </span>
        <span className="text-muted-foreground ml-1">
          ★
        </span>
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
