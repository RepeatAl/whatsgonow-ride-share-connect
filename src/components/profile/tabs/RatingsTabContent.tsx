
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import UserRating from "@/components/rating/UserRating";

interface RatingsTabContentProps {
  userId: string;
}

export function RatingsTabContent({ userId }: RatingsTabContentProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Deine Bewertungen</CardTitle>
        <CardDescription>
          Bewertungen, die du von anderen Nutzern erhalten hast
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Deine aktuelle Bewertung</h3>
            <UserRating userId={userId} size="lg" showDetails={true} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
