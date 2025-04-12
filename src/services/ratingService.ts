
// Mock rating service to simulate backend functionality
// In a real application, this would connect to a backend API

interface Rating {
  id: string;
  userId: string;
  orderId: string;
  ratedBy: string;
  rating: number;
  comment?: string;
  timestamp: Date;
}

interface RatingSubmission {
  userId: string;
  orderId: string;
  rating: number;
  comment?: string;
}

interface UserRatingSummary {
  average: number;
  count: number;
  ratings: Rating[];
}

// Mock storage
const mockRatings: Rating[] = [
  {
    id: "rating-1",
    userId: "user-1",
    orderId: "order-1",
    ratedBy: "user-2",
    rating: 5,
    comment: "Sehr zuverlässig und pünktlich",
    timestamp: new Date(2023, 10, 15)
  },
  {
    id: "rating-2",
    userId: "user-1",
    orderId: "order-2",
    ratedBy: "user-3",
    rating: 4,
    comment: "Gute Kommunikation",
    timestamp: new Date(2023, 11, 2)
  },
  {
    id: "rating-3",
    userId: "user-2",
    orderId: "order-3",
    ratedBy: "user-1",
    rating: 5,
    comment: "Perfekte Abwicklung",
    timestamp: new Date(2023, 11, 10)
  }
];

export const ratingService = {
  // Submit a new rating
  submitRating: async (submission: RatingSubmission): Promise<Rating> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create new rating
    const newRating: Rating = {
      id: `rating-${Date.now()}`,
      userId: submission.userId,
      orderId: submission.orderId,
      ratedBy: "current-user", // In a real app, this would be the current user's ID
      rating: submission.rating,
      comment: submission.comment,
      timestamp: new Date()
    };
    
    // In a real app, this would be saved to a database
    mockRatings.push(newRating);
    
    return newRating;
  },
  
  // Get ratings for a specific user
  getUserRatings: async (userId: string): Promise<UserRatingSummary> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter ratings for the user
    const userRatings = mockRatings.filter(rating => rating.userId === userId);
    
    // Calculate average rating
    const totalRating = userRatings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = userRatings.length > 0 ? totalRating / userRatings.length : 0;
    
    return {
      average: averageRating,
      count: userRatings.length,
      ratings: userRatings
    };
  },
  
  // Get a specific rating
  getRating: async (ratingId: string): Promise<Rating | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the rating
    const rating = mockRatings.find(r => r.id === ratingId);
    
    return rating || null;
  },
  
  // Check if user has already rated an order
  hasRated: async (userId: string, orderId: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if rating exists
    return mockRatings.some(rating => 
      rating.orderId === orderId && rating.ratedBy === userId
    );
  }
};
