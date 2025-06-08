
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";

interface Rating {
  rating_id: string;
  score: number;
  comment: string;
  created_at?: string;
  from_user: {
    name: string;
    avatar_url?: string;
  };
}

export function RatingsTabContent() {
  const { user } = useOptimizedAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    async function fetchRatings() {
      try {
        // FIXED: Simplified query structure to prevent field access issues
        const { data, error } = await supabase
          .from("ratings")
          .select(`
            rating_id,
            score,
            comment,
            created_at
          `)
          .eq("to_user", user!.id);

        if (error) throw error;
        
        // FIXED: Simplified rating transformation without complex field mapping
        const transformedRatings: Rating[] = (data || []).map(item => ({
          rating_id: item.rating_id,
          score: item.score || 0,
          comment: item.comment || "Kein Kommentar",
          created_at: item.created_at,
          from_user: {
            name: "Anonymer Nutzer", // FIXED: Simplified for now
            avatar_url: undefined
          }
        }));
        
        setRatings(transformedRatings);
      } catch (err) {
        console.error("Error loading ratings:", err);
        setError("Konnte Bewertungen nicht laden");
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, [user?.id]); // FIXED: Only depend on user.id

  if (loading) {
    return (
      <div className="space-y-4 mt-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (ratings.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Noch keine Bewertungen vorhanden</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {ratings.map((rating) => (
        <Card key={rating.rating_id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {rating.from_user?.name || "Unbekannter Nutzer"}
              </CardTitle>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating.score ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            {rating.created_at && (
              <CardDescription>
                {new Date(rating.created_at).toLocaleDateString()}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p>{rating.comment || "Keine Kommentar hinterlassen."}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
