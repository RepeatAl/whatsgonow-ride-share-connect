
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { RateUser } from "@/components/rating/RateUser";

interface RatingSectionProps {
  orderId: string;
  userId: string;
  currentUserId: string;
  hasRated: boolean;
  role: "driver" | "sender";
}

export const RatingSection = ({
  orderId,
  userId,
  currentUserId,
  hasRated,
  role,
}: RatingSectionProps) => {
  const [showRatingForm, setShowRatingForm] = useState(false);

  if (hasRated) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-gray-800 mb-1">Bewertung</h2>
            <p className="text-sm text-gray-600">
              Vielen Dank für deine Bewertung!
            </p>
          </div>
          <Button variant="outline" disabled>
            <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
            Bereits bewertet
          </Button>
        </div>
      </div>
    );
  }

  if (showRatingForm) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
        <RateUser
          orderId={orderId}
          toUser={userId}
          fromUser={currentUserId}
          role={role}
          onRatingComplete={() => setShowRatingForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-gray-800 mb-1">Bewertung</h2>
          <p className="text-sm text-gray-600">
            Bewerte den {role === "driver" ? "Fahrer" : "Auftraggeber"} für
            diesen Auftrag
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowRatingForm(true)}>
          <Star className="h-4 w-4 mr-2" />
          Jetzt bewerten
        </Button>
      </div>
    </div>
  );
};
