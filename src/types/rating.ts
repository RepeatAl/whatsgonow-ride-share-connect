
export interface UserRating {
  id: string;
  userId: string;
  orderId: string;
  rating: number;
  comment?: string;
  timestamp: Date;
}

export interface RatingStats {
  average: number;
  count: number;
}

export const calculateAverageRating = (ratings: number[]): RatingStats => {
  if (!ratings.length) {
    return { average: 0, count: 0 };
  }
  
  const sum = ratings.reduce((total, rating) => total + rating, 0);
  return {
    average: Number((sum / ratings.length).toFixed(1)),
    count: ratings.length
  };
};
