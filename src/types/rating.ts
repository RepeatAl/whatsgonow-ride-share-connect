
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
