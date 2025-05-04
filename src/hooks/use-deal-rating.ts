
import { useState, useEffect } from "react";
import { ratingService } from "@/services/ratingService";

export function useDealRating(orderId: string, status: string, paymentStatus?: string) {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (status === "delivered" && paymentStatus === "paid") {
      const checkRating = async () => {
        const hasUserRated = await ratingService.hasRated("current-user", orderId);
        setHasRated(hasUserRated);
        
        if (!hasUserRated) {
          setShowRatingModal(true);
        }
      };
      
      checkRating();
    }
  }, [status, paymentStatus, orderId]);

  return {
    showRatingModal,
    setShowRatingModal,
    hasRated
  };
}
