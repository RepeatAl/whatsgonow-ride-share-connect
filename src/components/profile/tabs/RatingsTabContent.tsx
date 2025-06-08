
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";

// This file follows the conventions from /docs/conventions/roles_and_ids.md
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
    if (!user?.id) return;
    
    async function fetchRatings() {
      try {
        // Updated query to use from_user_id and to_user_id
        const { data, error } = await supabase
          .from("ratings")
          .select(`
            rating_id,
            score,
            comment,
            created_at,
            from_user_id (
              name,
              avatar_url
            )
          `)
          .eq("to_user_id", user!.id);

        if (error) throw error;
        
        // Transform the data to match our Rating type
        const transformedRatings: Rating[] = (data || []).map(item => {
          // Debug the structure of from_user_id
          console.log("Rating item structure:", item);
          
          // Handle the case where from_user_id might be an array or an object
          const fromUser = Array.isArray(item.from_user_id) 
            ? item.from_user_id[0] 
            : item.from_user_id;
          
          return {
            rating_id: item.rating_id,
            score: item.score,
            comment: item.comment,
            created_at: item.created_at,
            from_user: {
              name: fromUser?.name || "Unbekannter Nutzer",
              avatar_url: fromUser?.avatar_url
            }
          };
        });
        
        setRatings(transformedRatings);
      } catch (err) {
        console.error("Error loading ratings:", err);
        setError("Konnte Bewertungen nicht laden");
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, [user?.id]);

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
